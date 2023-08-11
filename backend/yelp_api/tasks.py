import json
import pickle
import os
import redis
from django.conf import settings
from django.http import JsonResponse
from celery import shared_task
import redis.exceptions
from yelp_api.models import AggregatedPredictions, Predictions
from rest_framework.response import Response
from .models import Cafe
from .serializers import Cafe_DB_Serializer
from datetime import date


@shared_task
def adding_task(x, y):
    return x + y

# tasks.py (located in your Django app directory)

@shared_task
def calculate_and_cache_predictions(day, month, week_of_year):




    print(f"Day: {day}")
    print(f"Month: {month}")
    print(f"Week of Year: {week_of_year}")


    inputs = [day, month, week_of_year]

    predictions_data = Predictions.objects.filter(
            week_of_year=week_of_year,
        )

        # Check if any predictions are found, return a 404 response if not found
    if not predictions_data.exists():
            return Response({'error': 'Data not found.'}, status=404)

        # Calculate the global min and max values for normalization
    all_predictions = [prediction.prediction for prediction in predictions_data]
    prediction_min = min(all_predictions)
    prediction_max = max(all_predictions)

    # Prepare the output data
    all_model_predictions = {}

    try:
        # Attempt to connect to Redis
        redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

        # Generate the Redis key using the input parameters
        redis_key = f"model_predictions:{day}-{month}-{week_of_year}"

        # Check if the predictions are already cached in Redis
        cached_predictions = redis_client.get(redis_key)

        if cached_predictions is not None:
            # If the predictions are already cached, load and use them
            all_model_predictions = json.loads(cached_predictions)
            print("24 hour predictions are already in the cache.")
        else:
            # If the predictions are not cached, unpickle the models and calculate predictions

            for prediction in predictions_data:
                location_id = prediction.location_id
                hour = prediction.hour
                week_of_year = prediction.week_of_year
                day = prediction.day
                prediction_value = prediction.prediction
                normalized_prediction = (prediction_value - prediction_min) / (prediction_max - prediction_min)

                # Create day_key and location_key without any prefixes
                hour_key = str(hour)
                day_key = str(day)
                location_key = str(location_id)

                # Check if the location_key exists in the dictionary, if not, create an empty dictionary for that model
                if location_key not in all_model_predictions:
                    all_model_predictions[location_key] = {}

                all_model_predictions[location_key][hour_key] = normalized_prediction

            # Store all the predictions as one large JSON object in Redis
            redis_client.set(redis_key, json.dumps(all_model_predictions))
            print("Daily Cache was not used for predictions. Calculated predictions instead")
            redis_client.expire(redis_key, 24 * 60 * 60)
            print("24 hour expiry set")
          
          
          
    except redis.exceptions.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache for 24 hour predictions.")

    return "Task completed successfully!"
    


       
@shared_task
def weekly_predictions(week_of_year):
    # Retrieve data from the AggregatedPredictions model based on the provided parameters
    predictions_data = AggregatedPredictions.objects.filter(
        week_of_year=week_of_year,
    )

    # Check if any predictions are found, return a 404 response if not found
    if not predictions_data.exists():
        return Response({'error': 'Data not found.'}, status=404)

    # Calculate the global min and max values for normalization
    all_predictions = [prediction.average_prediction for prediction in predictions_data]
    prediction_min = min(all_predictions)
    prediction_max = max(all_predictions)

    # Prepare the output data
    all_model_predictions = {}

    try:
        # Attempt to connect to Redis
        redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

        # Generate the Redis key using the input parameters
        redis_key = f"Weekly_Predictions:-{week_of_year}"

        # Check if the predictions are already cached in Redis
        cached_predictions = redis_client.get(redis_key)

        if cached_predictions is not None:
            # If the predictions are already cached, use the cached data
            all_model_predictions = json.loads(cached_predictions)
            print("Cache was used for weekly predictions.")
        else:
            # If the predictions are not cached, calculate predictions
            for prediction in predictions_data:
                location_id = prediction.location_id
                week_of_year = prediction.week_of_year
                day = prediction.day
                prediction_value = prediction.average_prediction
                normalized_prediction = (prediction_value - prediction_min) / (prediction_max - prediction_min)

                # Create day_key and location_key without any prefixes
                day_key = str(day)
                location_key = str(location_id)

                # Check if the location_key exists in the dictionary, if not, create an empty dictionary for that model
                if location_key not in all_model_predictions:
                    all_model_predictions[location_key] = {}

                all_model_predictions[location_key][day_key] = normalized_prediction

            # Store all the predictions as one large JSON object in Redis
            redis_client.set(redis_key, json.dumps(all_model_predictions))
            print("Cache was not used for weekly predictions. Calculated weekly predictions instead")
            redis_client.expire(redis_key, 24 * 60 * 60)
            print("7 day expiry set for weekly predictions")


    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache for 7 day predictions.")

    # Return the predictions as a JSON response
    return "Task completed successfully!"

@shared_task
def cafes_api():
    try:
        redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

        # Create a key with Yelp API and current date - 24-hour caching as per Yelp Requirements
        redis_key = f"Yelp_API:{date.today()}:Manhattan"

        # Check if the data is already cached in Redis
        cached_data = redis_client.get(redis_key)

        if cached_data is not None:
            # If the data is cached in Redis, retrieve and return it
            print("Data is already in the cache.")

        # If the data is not cached, fetch it from the database
        cafes_list = list(Cafe.objects.values())
        print("Cafes in database:", len(cafes_list))

        cafes_list = Cafe.objects.all()
        serializer = Cafe_DB_Serializer(cafes_list, many=True)


        # Serialize the data for storing in Redis and return it
        redis_client.set(redis_key, json.dumps(serializer.data))

        # Store the serialized data in Redis with the specified key for future use
        print("Yelp API Data stored in Redis from the database.")

        # Set a 24-hour expiry as using today's date as the key
        redis_client.expire(redis_key, 24 * 60 * 60)
        return "Task completed successfully!"

    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache when trying to get cafe info.")
        raise redis.ConnectionError("Unable to connect to the Redis cache.")