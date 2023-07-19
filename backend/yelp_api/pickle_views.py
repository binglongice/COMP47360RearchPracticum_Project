# Used to load in predictions via pickle models
import os
import pickle
import numpy as np
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
import redis

redis_host = '127.0.0.1'
redis_port = '6379'
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

@api_view(['GET'])
def model_output_api(request, hour, day, month, week_of_month):
    print(f"Hour: {hour}")
    print(f"Day: {day}")
    print(f"Month: {month}")
    print(f"Week of Month: {week_of_month}")

    # Define the model numbers you want to include
    model_numbers = [4, 12, 13, 24, 41, 42, 43, 45, 48, 50, 68, 74, 75, 79, 87, 88, 90, 100, 107, 113,
                     114, 116, 120, 125, 127, 128, 137, 140, 141, 142, 143, 144, 148, 151, 152, 153,
                     158, 161, 162, 163, 164, 166, 170, 186, 194, 202, 209, 211, 224, 229, 230, 231,
                     232, 233, 234, 236, 237, 238, 239, 243, 244, 246, 249, 261, 262, 263]

    # Prepare the inputs
    inputs = [hour, day, month, week_of_month]

    # Generate the Redis key using the input parameters
    redis_key = f"model_predictions:{hour}-{day}-{month}-{week_of_month}"

    # Check if the predictions are already cached in Redis
    cached_predictions = redis_client.get(redis_key)


    if cached_predictions is not None:
        # If the predictions are already cached, load and use them
        all_model_predictions = json.loads(cached_predictions)
        print("Cache was used.")
    else:
        # If the predictions are not cached, unpickle the models and calculate predictions
        all_model_predictions = {}
        all_predictions = []
        for model_number in model_numbers:
            pickle_file = os.path.join('pickle_models', f'model_{model_number}.pkl')
            with open(pickle_file, 'rb') as f:
                model = pickle.load(f)
            prediction = model.predict([inputs])
            all_predictions.extend(prediction)
            all_model_predictions[f'model_{model_number}'] = prediction.tolist()

        # Calculate the global min and max values
        prediction_min = min(all_predictions)
        prediction_max = max(all_predictions)

        # Normalize each prediction array before adding it to all_model_predictions
        for model_number in model_numbers:
            prediction = np.array(all_model_predictions[f'model_{model_number}'])
            normalized_prediction = (prediction - prediction_min) / (prediction_max - prediction_min)
            # Update the dictionary with normalized values between 0 and 1
            
            all_model_predictions[f'model_{model_number}'] = normalized_prediction.tolist()
        
        print("Normalization has occurred.")

        # Store all the predictions as one large JSON object in Redis
        redis_client.set(redis_key, json.dumps(all_model_predictions))
        print("Cache was not used.")

    # Return the predictions as a JSON response
    return JsonResponse(all_model_predictions)

