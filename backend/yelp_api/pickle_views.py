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

# 24 hour prediction grouped by hour

@api_view(['GET'])
def model_output_api(request, day, month, week_of_year):
    print(f"Day: {day}")
    print(f"Month: {month}")
    print(f"Week of Year: {week_of_year}")

    # Define the model numbers you want to include
    model_numbers = [4, 12, 13, 24, 41, 42, 43, 45, 48, 50, 68, 74, 75, 79, 87, 88, 90, 100, 107, 113,
                     114, 116, 120, 125, 127, 128, 137, 140, 141, 142, 143, 144, 148, 151, 152, 153,
                     158, 161, 162, 163, 164, 166, 170, 186, 194, 202, 209, 211, 224, 229, 230, 231,
                     232, 233, 234, 236, 237, 238, 239, 243, 244, 246, 249, 261, 262, 263]

    # Prepare the inputs (hour is not needed as an input anymore)
    inputs = [day, month, week_of_year]

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
            print("Cache was used for predictions.")
        else:
            # If the predictions are not cached, unpickle the models and calculate predictions
            all_model_predictions = {f'{model_number}': {} for model_number in model_numbers}
            for model_number in model_numbers:
                pickle_file = os.path.join('pickle_models', f'model_{model_number}.pkl')
                with open(pickle_file, 'rb') as f:
                    model = pickle.load(f)

                # Calculate predictions for each hour of the day
                for hour in range(24):
                    inputs_with_hour = [hour] + inputs
                    prediction = model.predict([inputs_with_hour])
                    all_model_predictions[f'{model_number}'][f'{hour}'] = prediction[0]  # Get the prediction value for the hour

            # Calculate the global min and max values
            all_predictions = [prediction for predictions_by_model in all_model_predictions.values() for prediction in predictions_by_model.values()]
            prediction_min = min(all_predictions)
            prediction_max = max(all_predictions)

            # Normalize each prediction array before adding it to all_model_predictions
            for model_number, predictions_by_hour in all_model_predictions.items():
                for hour, prediction in predictions_by_hour.items():
                    normalized_prediction = (prediction - prediction_min) / (prediction_max - prediction_min)
                    all_model_predictions[model_number][hour] = normalized_prediction.tolist()

            print("Normalization has occurred for predictions.")

            # Store all the predictions as one large JSON object in Redis
            redis_client.set(redis_key, json.dumps(all_model_predictions))
            print("Cache was not used for predictions. Unpickled models instead")
            redis_client.expire(redis_key, 24 * 60 * 60)
            print("24 hour expiry set")

    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache for predictions.")
        # If Redis connection fails, directly calculate the predictions without using Redis
        all_model_predictions = {f'{model_number}': {} for model_number in model_numbers}
        for model_number in model_numbers:
            pickle_file = os.path.join('pickle_models', f'model_{model_number}.pkl')
            with open(pickle_file, 'rb') as f:
                model = pickle.load(f)

            # Calculate predictions for each hour of the day
            for hour in range(24):
                inputs_with_hour = [hour] + inputs
                prediction = model.predict([inputs_with_hour])
                all_model_predictions[f'{model_number}'][f'{hour}'] = prediction[0]  # Get the prediction value for the hour

        # Calculate the global min and max values
        all_predictions = [prediction for predictions_by_model in all_model_predictions.values() for prediction in predictions_by_model.values()]
        prediction_min = min(all_predictions)
        prediction_max = max(all_predictions)

        # Normalize each prediction array before adding it to all_model_predictions
        for model_number, predictions_by_hour in all_model_predictions.items():
            for hour, prediction in predictions_by_hour.items():
                normalized_prediction = (prediction - prediction_min) / (prediction_max - prediction_min)
                all_model_predictions[model_number][hour] = normalized_prediction.tolist()

        print("Normalization has occurred for predictions. Unpickled models instead")

    # Return the predictions as a JSON response
    return JsonResponse(all_model_predictions)
