# Used to load in predictions via pickle models
import os
import pickle
import numpy as np
import json
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
import redis
from django.conf import settings
from django.shortcuts import get_object_or_404
from yelp_api.models import AggregatedPredictions, MonthlyPredictions, Predictions


# 24 hour prediction grouped by hour

@api_view(['GET'])
def model_output_api(request, day, month, week_of_year):
    print(f"Day: {day}")
    print(f"Month: {month}")
    print(f"Week of Year: {week_of_year}")

    # Define the model numbers you want to include
    #model_numbers = [4, 12, 13, 24, 41, 42, 43, 45, 48, 50, 68, 74, 75, 79, 87, 88, 90, 100, 107, 113,
     #                114, 116, 120, 125, 127, 128, 137, 140, 141, 142, 143, 144, 148, 151, 152, 153,
      #               158, 161, 162, 163, 164, 166, 170, 186, 194, 202, 209, 211, 224, 229, 230, 231,
       #              232, 233, 234, 236, 237, 238, 239, 243, 244, 246, 249, 261, 262, 263]

    # Prepare the inputs (hour is not needed as an input anymore)
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
            print("Daily Cache was used for predictions.")
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
            print(" Daily Cache was not used for predictions. Calculated predictions instead")
            redis_client.expire(redis_key, 24 * 60 * 60)
            print("24 hour expiry set")
          
          
          
          


    except redis.ConnectionError:
        # Handle Redis connection error gracefully

        
        print("Error: Unable to connect to the Redis cache for predictions.")
        # If Redis connection fails, directly calculate the predictions without using Redis

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
        print("Normalization has occurred for predictions. Calculated predictions instead")




    # Return the predictions as a JSON response
    return JsonResponse(all_model_predictions)


@api_view(['GET'])
def weekly_aggregation_api(request, week_of_year):
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
            print("Cache was used for predictions.")
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
            print("Cache was not used for predictions. Calculated predictions instead")
            redis_client.expire(redis_key, 169 * 60 * 60)
            print("7 day expiry set")


    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache for predictions.")
        # If Redis connection fails, directly calculate the predictions without using Redis
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

        print("Normalization has occurred for predictions. Calculated predictions instead")

    # Return the predictions as a JSON response
    return JsonResponse(all_model_predictions, safe=False)


@api_view(['GET'])
def monthly_aggregation_api(request):
    # Retrieve data from the AggregatedPredictions model based on the provided parameters
    predictions_data = MonthlyPredictions.objects.all()
    
    # Check if any predictions are found, return a 404 response if not found
    if not predictions_data.exists():
        return Response({'error': 'Data not found.'}, status=404)
    
    # Calculate the global min and max values for normalization
    all_predictions = [prediction.monthly_prediction for prediction in predictions_data]
    prediction_min = min(all_predictions)
    prediction_max = max(all_predictions)

    # Prepare the output data
    all_model_predictions = {}

    try:
        # Attempt to connect to Redis
        redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

        # Generate the Redis key using the input parameters
        redis_key = f"MonthlyPrediction"

        # Check if the predictions are already cached in Redis
        cached_predictions = redis_client.get(redis_key)

        if cached_predictions is not None:
            # If the predictions are already cached, use the cached data
            all_model_predictions = json.loads(cached_predictions)
            print("Cache was used for predictions.")
        else:
            # If the predictions are not cached, calculate predictions
            for prediction in predictions_data:
                location_id = prediction.location_id
                month = prediction.month
                prediction_value = prediction.monthly_prediction
                normalized_prediction = (prediction_value - prediction_min) / (prediction_max - prediction_min)

                # Create month_key and location_key without any prefixes
                month_key = str(month)
                location_key = str(location_id)

                # Check if the location_key exists in the dictionary, if not, create an empty dictionary for that model
                if location_key not in all_model_predictions:
                    all_model_predictions[location_key] = {}

                all_model_predictions[location_key][month_key] = normalized_prediction

            # Store all the predictions as one large JSON object in Redis
            redis_client.set(redis_key, json.dumps(all_model_predictions))
            print("Cache was not used for predictions. Calculated predictions instead")

    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache for predictions.")
        # If Redis connection fails, directly calculate the predictions without using Redis
        for prediction in predictions_data:
            location_id = prediction.location_id
            month = prediction.month
            prediction_value = prediction.monthly_prediction
            normalized_prediction = (prediction_value - prediction_min) / (prediction_max - prediction_min)

            # Create month_key and location_key without any prefixes
            month_key = str(month)
            location_key = str(location_id)

            # Check if the location_key exists in the dictionary, if not, create an empty dictionary for that model
            if location_key not in all_model_predictions:
                all_model_predictions[location_key] = {}

            all_model_predictions[location_key][month_key] = normalized_prediction

        print("Normalization has occurred for predictions. Calculated predictions instead")

    # Return the predictions as a JSON response
    return JsonResponse(all_model_predictions, safe=False)












