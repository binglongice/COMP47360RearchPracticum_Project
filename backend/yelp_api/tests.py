from django.test import TestCase
from unittest.mock import patch, MagicMock
from yelp_api.api import search_cafes, get_reviews
from yelp_api.models import Cafe, Predictions, AggregatedPredictions, MonthlyPredictions
from django.test import TestCase, Client
from django.urls import reverse
import json
from django.core.exceptions import ObjectDoesNotExist


# Testing functions in api module of yelp_api

class YelpApiTestCase(TestCase):
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

# Testing the functions of models.py
# tests.py

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


class ModelOutputAPITestCase(TestCase):
    def test_model_output_api(self):
        client = Client()

        # Make a GET request to the model_output_api endpoint with specific day, month, and week_of_year values
        url = reverse('model-output-api', args=[1, 7, 30])
        print(f"24 hour url", url)
        response = client.get(url)

        # Assert that the response status code is 200 (OK)
        self.assertEqual(response.status_code, 200)

        # Convert the JSON response to a Python dictionary
        response_data = response.json()

        # Assert that the response data is a dictionary
        self.assertIsInstance(response_data, dict)

        # Add specific assertions for the JSON format, grouping by model and then by hour (0-23)
        for model_number, hour_predictions in response_data.items():
            self.assertIsInstance(hour_predictions, dict)
            for hour, prediction in hour_predictions.items():
                self.assertIn(hour, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                                     '10', '11', '12', '13', '14', '15', '16', '17',
                                     '18', '19', '20', '21', '22', '23'])
                self.assertIsInstance(prediction, float)


class WeeklyAggregationAPITestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test data for the WeeklyAggregationAPI
        # For example, create a sample AggregatedPredictions object in the test database
        week_of_year = 30
        location_id = 4
        day = 1
        month = 7
        average_prediction = 115
        AggregatedPredictions.objects.create(
            week_of_year=week_of_year,
            month=month,  # Set the correct month value
            location_id=location_id,
            day=day,
            average_prediction=average_prediction
        )

    def test_weekly_aggregation_api(self):
        # Make a GET request to the weekly_aggregation_api endpoint with specific week_of_year value
        url = reverse('weekly-aggregation-api', args=[30])
        print("weekly url", url)
        response = self.client.get(url)
        print("weekly response", response)
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
            print("expected prediction", expected_prediction)

            # Perform normalization
            prediction_min = 4
            prediction_max = 7674
            normalized_expected_prediction = (expected_prediction - prediction_min) / (prediction_max - prediction_min)

            # Compare the response with the expected prediction value
            self.assertAlmostEqual(normalized_expected_prediction, response_data['4']['1'])

        except ObjectDoesNotExist:
            self.fail('Test data not found in the database.')



class MonthlyAggregationAPITestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create test data for the MonthlyAggregationAPI
        # For example, create a sample MonthlyPredictions object in the test database
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
        expected_normalized_prediction = (111 - 1) / (6718 - 111)  # Replace 111 with actual prediction_min and prediction_max if available

        # Check if the normalized value is approximately equal to the expected normalized value
        self.assertAlmostEqual(expected_normalized_prediction, response_data['4']['7'], places=2)
