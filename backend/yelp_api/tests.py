from django.test import TestCase
from unittest.mock import patch, MagicMock
from yelp_api.api import search_cafes, get_reviews
from yelp_api.models import Cafe, Predictions, AggregatedPredictions, MonthlyPredictions
from django.test import TestCase, Client
from django.urls import reverse
import json
from django.core.exceptions import ObjectDoesNotExist
from yelp_api.serializers import PredictionsSerializer, AggregatedPredictionsSerializer
from django.test import SimpleTestCase
from django.urls import reverse, resolve
from yelp_api.views import cafes_api, predictions_api, review_api
from yelp_api.pickle_views import model_output_api, weekly_aggregation_api, monthly_aggregation_api
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from collections import OrderedDict


# Testing functions in api module #

class YelpApiTestCase(TestCase):

    # testing the search_cafes function in api

    @patch('yelp_api.api.requests.get')
    def test_search_cafes(self, mock_requests_get):
        # Simulate the response rather than make an actual API call
        expected_response = {
            "businesses": [{"name": "Cafe A"}, {"name": "Cafe B"}],
            "total": 2,
        }
        mock_requests_get.return_value = MagicMock(json=lambda: expected_response)

        # Test the search_cafes function with a specific location and offset
        location = "New York City"
        offset = 0
        response_data = search_cafes(location, offset)

        # Test if the response contains the expected keys - i.e. if the data is processed and stored in a dictionary correctly
        self.assertIn("businesses", response_data)
        self.assertIn("total", response_data)

        # Testing that businesses are returned as a list and total as an integer
        self.assertIsInstance(response_data["businesses"], list)
        self.assertIsInstance(response_data["total"], int)

    # testing the get_reviews function in api

    @patch('yelp_api.api.requests.get')
    def test_get_reviews(self, mock_requests_get):
        # Mock the API response for get_reviews
        expected_response = {
            "reviews": [{"text": "Review 1"}, {"text": "Review 2"}],
        }
        mock_requests_get.return_value = MagicMock(json=lambda: expected_response)

        # Test the get_reviews function with a specific business id
        business_id = "some_business_id"
        response_data = get_reviews(business_id)

        # Test if the response contains reviews
        self.assertIn("reviews", response_data)

        # Test if the response contains reviews as a list
        self.assertIsInstance(response_data["reviews"], list)


# Testing the functions in models module # 

# Testing class cafe and associated functions in models
class CafeModelTestCase(TestCase):
    def setUp(self):
        # Create a sample Cafe instance for testing
        self.cafe = Cafe.objects.create(
            id="12345",
            name="Test Cafe",
            address="123 Test St",
            rating=4.5,
            latitude=37.12345,
            longitude=-122.54321,
            image_url="https://example.com/cafe.jpg",
        )

    def test_cafe_str_method(self):
        # Test the __str__ method of the Cafe model
        expected_str = "Test Cafe"
        self.assertEqual(str(self.cafe), expected_str)

    def test_cafe_fields(self):
        # Test that the fields of the Cafe model have the correct attributes and data types
        self.assertEqual(self.cafe._meta.get_field("id").primary_key, True)
        self.assertEqual(self.cafe._meta.get_field("name").max_length, 255)
        self.assertEqual(self.cafe._meta.get_field("address").max_length, 255)
        self.assertEqual(self.cafe._meta.get_field("rating").max_digits, 3)
        self.assertEqual(self.cafe._meta.get_field("rating").decimal_places, 1)
        self.assertIsInstance(self.cafe.rating, float)
        self.assertIsInstance(self.cafe.latitude, float)
        self.assertIsInstance(self.cafe.longitude, float)
        self.assertEqual(self.cafe._meta.get_field("image_url").max_length, 255)


# Testing class predictions in models
class PredictionsModelTestCase(TestCase):
    def setUp(self):
        # Create a sample Predictions instance for testing
        self.predictions = Predictions.objects.create(
            location_id=1,
            hour=12,
            day=1,
            month=1,
            week_of_year=1,
            prediction=50,
            datetime="2023-07-31 12:00:00",
        )

    def test_predictions_fields(self):
        # Test that the fields of the Predictions model have the correct attributes and data types
        self.assertEqual(self.predictions._meta.get_field("location_id").primary_key, True)
        self.assertIsInstance(self.predictions.location_id, int)
        self.assertIsInstance(self.predictions.hour, int)
        self.assertIsInstance(self.predictions.day, int)
        self.assertIsInstance(self.predictions.month, int)
        self.assertIsInstance(self.predictions.week_of_year, int)
        self.assertIsInstance(self.predictions.prediction, int)
        self.assertIsInstance(self.predictions.datetime, str)


# Testing class aggregated predictions in models
class AggregatedPredictionsModelTestCase(TestCase):
    def setUp(self):
        # Create a sample AggregatedPredictions instance for testing
        self.aggregated_predictions = AggregatedPredictions.objects.create(
            location_id=1,
            day=1,
            month=1,
            week_of_year=1,
            average_prediction=60,
        )

    def test_aggregated_predictions_fields(self):
        # Test that the fields of the AggregatedPredictions model have the correct attributes and data types
        self.assertIsInstance(self.aggregated_predictions.location_id, int)
        self.assertIsInstance(self.aggregated_predictions.day, int)
        self.assertIsInstance(self.aggregated_predictions.month, int)
        self.assertIsInstance(self.aggregated_predictions.week_of_year, int)
        self.assertIsInstance(self.aggregated_predictions.average_prediction, int)


# Testing class monthly predictions in models
class MonthlyPredictionsModelTestCase(TestCase):
    def setUp(self):
        # Create a sample MonthlyPredictions instance for testing
        self.monthly_predictions = MonthlyPredictions.objects.create(
            location_id=1,
            month=1,
            monthly_prediction=70,
        )

    def test_monthly_predictions_fields(self):
        # Test that the fields of the MonthlyPredictions model have the correct attributes and data types
        self.assertIsInstance(self.monthly_predictions.location_id, int)
        self.assertIsInstance(self.monthly_predictions.month, int)
        self.assertIsInstance(self.monthly_predictions.monthly_prediction, int)


# Testing functions in pickle_views module #

# Testing model_output_api in pickle_views
class ModelOutputAPITestCase(TestCase):
    def test_model_output_api(self):
        client = Client()

        # Make a GET request to the model_output_api endpoint with specific day, month, and week_of_year values
        url = reverse('model-output-api', args=[1, 7, 30])
        response = client.get(url)

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, 200)

        # Convert the JSON response to a Python dictionary
        response_data = response.json()

        # Assert that the response data is a dictionary
        self.assertIsInstance(response_data, dict)

        # Add specific assertions for the JSON format, grouping by model and then by hour (0-23)
        # Checking that the response contains each of the hours
        for model_number, hour_predictions in response_data.items():
            self.assertIsInstance(hour_predictions, dict)
            for hour, prediction in hour_predictions.items():
                self.assertIn(hour, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                                     '10', '11', '12', '13', '14', '15', '16', '17',
                                     '18', '19', '20', '21', '22', '23'])
                self.assertIsInstance(prediction, float)


# Testing weekly_aggregation_api in pickle_views
class WeeklyAggregationAPITestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test data for the WeeklyAggregationAPI
       # This is the same as in the actual db
        week_of_year = 30
        location_id = 4
        day = 1
        month = 7
        average_prediction = 115
        AggregatedPredictions.objects.create(
            week_of_year=week_of_year,
            month=month,  
            location_id=location_id,
            day=day,
            average_prediction=average_prediction
        )

    def test_weekly_aggregation_api(self):
        # Make a GET request to the weekly_aggregation_api endpoint with specific week_of_year value
        url = reverse('weekly-aggregation-api', args=[30])
        # print("weekly url", url)
        response = self.client.get(url)
        # print("weekly response", response)
        self.assertEqual(response.status_code, 200)

        # Convert the JSON response to a Python dictionary
        response_data = response.json()
        # print("weekly response data", response_data)
        # print()
        # print("specific response data", response_data['4']['1'])

        # Assert that the response data is a dictionary
        self.assertIsInstance(response_data, dict)

        # Query the test database to get the expected prediction for the specific week_of_year, location_id, and day
        try:
            prediction = AggregatedPredictions.objects.get(week_of_year=30, location_id=4, day=1)
            expected_prediction = prediction.average_prediction
            # print("expected prediction", expected_prediction)

            # Perform normalization
            # Had to find actual min and max from the db so the normalisation would be the same
            prediction_min = 4
            prediction_max = 7674
            normalized_expected_prediction = (expected_prediction - prediction_min) / (prediction_max - prediction_min)

            # Compare the response with the expected prediction value
            self.assertAlmostEqual(normalized_expected_prediction, response_data['4']['1'])

        except ObjectDoesNotExist:
            self.fail('Test data not found in the database.')

# For weekly_aggregation_api provided actual data same as in db to ensure we could normalise and
# return the same data as returned in the JSON response

# Testing monthly_aggregation_api in pickle_views
class MonthlyAggregationAPITestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test data for the MonthlyAggregationAPI
        # Again actual data to ensure normalisation works correctly
        location_id = 4
        month = 7
        monthly_prediction = 111
        MonthlyPredictions.objects.create(
            location_id=location_id,
            month=month,
            monthly_prediction=monthly_prediction
        )

    def test_monthly_aggregation_api(self):
        # Make a GET request to the monthly_aggregation_api endpoint
        url = reverse('monthly-aggregation-api')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Convert the JSON response to a Python dictionary
        response_data = response.json()
        # print("specific response data", response_data['4']['7'])

        # Assert that the response data is a dictionary
        self.assertIsInstance(response_data, dict)

        # Expected normalized value (manually calculated)
        # Had to find actual max and min in same manner as weekly
        expected_normalized_prediction = (111 - 1) / (6718 - 111)  

        # Check if the normalized value is approximately equal to the expected normalized value
        self.assertAlmostEqual(expected_normalized_prediction, response_data['4']['7'], places=2)

# Again sample data is an actual row in db and had to perform normalisation in same way as in db

# Testing functions in serialisers # 

# Testing predictionsserialiser in serialisers
class PredictionsSerializerTestCase(TestCase):
    def test_serialization(self):
        # Create a sample Predictions instance with required attributes
        prediction_data = {
            'location_id': 4,
            'hour': 12,
            'day': 6,
            'month': 7,
            'week_of_year': 31,
            'prediction': 111, 
        }
        serializer = PredictionsSerializer(data=prediction_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Check if the serializer can create an instance from the data
        instance = serializer.save()

        # Check if the serialized data matches the original data
        self.assertEqual(serializer.data, prediction_data)

        # Check if the instance is properly saved to the database
        saved_instance = Predictions.objects.get(pk=instance.pk)
        self.assertEqual(saved_instance.location_id, 4)

# Testing aggregate predictions in serialisers
class AggregatedPredictionsSerializerTestCase(TestCase):
    def test_serialization(self):
        # Create a sample AggregatedPredictions instance with required attributes
        aggregated_prediction_data = {
            'location_id': 1,
            'day': 1,
            'month': 7,
            'week_of_year': 30,
            'average_prediction': 100, 
        }
        serializer = AggregatedPredictionsSerializer(data=aggregated_prediction_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Check if the serializer can create an instance from the data
        instance = serializer.save()

        # Check if the serialized data matches the original data
        self.assertEqual(serializer.data, aggregated_prediction_data)

        # Check if the instance is properly saved to the database
        saved_instance = AggregatedPredictions.objects.get(pk=instance.pk)
        self.assertEqual(saved_instance.location_id, 1)

# Testing functions in urls #

class TestUrls(SimpleTestCase):
    def test_cafes_api_url_resolves(self):
        url = reverse('cafes_api', args=['location'])
        self.assertEqual(resolve(url).func, cafes_api)

    def test_predictions_api_url_resolves(self):
        url = reverse('predictions_api', args=['location'])
        self.assertEqual(resolve(url).func, predictions_api)

    def test_review_api_url_resolves(self):
        url = reverse('review-api', args=['id'])
        self.assertEqual(resolve(url).func, review_api)

    def test_model_output_api_url_resolves(self):
        url = reverse('model-output-api', args=[1, 2, 3]) 
        self.assertEqual(resolve(url).func, model_output_api)

    def test_weekly_aggregation_api_url_resolves(self):
        url = reverse('weekly-aggregation-api', args=[30])
        self.assertEqual(resolve(url).func, weekly_aggregation_api)

    def test_monthly_aggregation_api_url_resolves(self):
        url = reverse('monthly-aggregation-api')
        self.assertEqual(resolve(url).func, monthly_aggregation_api)


# Testing functions views.py

# Testing cafes_api in views
class CafeAPITest(APITestCase):
    def test_cafes_api(self):

        # actual cafe data
        cafes_data = [
            {
                'id': 'lXGCo-K7eftxRT_6E59-Iw',
                'name': 'Union Square Cafe',
                'address': '101 E 19th St',
                'rating': '4.0',
                'longitude': -73.987876,
                'latitude': 40.737772,
                'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/F2lCykdOrnAb_c7xQsYHIw/o.jpg',
            },
            {
                'id': 'gISZs8okQgFIpd-yz9aC4w',
                'name': 'Café Henri',
                'address': '1010 50th Ave',
                'rating': '4.0',
                'longitude': -73.953697,
                'latitude': 40.742559,
                'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/5x1y2Bdpw5lTxrDG2tBJxA/o.jpg',
            },
        ]
        for data in cafes_data:
            Cafe.objects.create(**data)

        url = reverse('cafes_api', kwargs={'location': 'Manhattan'})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Convert the response data to a list of dictionaries
        response_data_list = [dict(item) for item in response.data]

        # Check if sample (actual) data is present in JSON response
        for cafe_data in cafes_data:
            self.assertIn(cafe_data, response_data_list)


# Testing predictions_api in views

# Predictions not being used?
class PredictionsAPITest(APITestCase):
    def test_predictions_api(self):
        predictions_data = [
            # Add some prediction data
        ]
        for data in predictions_data:
            Predictions.objects.create(**data)

        url = reverse('predictions_api', kwargs={'location': 'your-location'})
        response = self.client.get(url)
        # print("predictions response", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('results' in response.data)
        self.assertEqual(len(response.data['results']), len(predictions_data))
# Outline should we use predictions, but not being used? f

# Testing review api in views
class ReviewAPITestCase(TestCase):
    def setUp(self):
        # Create a test client for making API requests
        self.client = APIClient()

    def test_review_api(self):
        business_id = 'lXGCo-K7eftxRT_6E59-Iw'
        url = reverse('review-api', args=[business_id])
        print("review api test case url", url)
        # Make a GET request to the review_api endpoint
        response = self.client.get(url)
        
        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the response data is a dictionary (parsed JSON)
        self.assertIsInstance(response.data, dict)
        
