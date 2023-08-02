# your_app/management/commands/populate_aggregated_predictions.py
from django.core.management.base import BaseCommand
from yelp_api.models import Predictions, AggregatedPredictions, MonthlyPredictions
from collections import defaultdict

class Command(BaseCommand):
    help = 'Populates the AggregatedPredictions model with aggregated data.'

    def handle(self, *args, **kwargs):
        # Delete all existing records from the AggregatedPredictions table
        AggregatedPredictions.objects.all().delete()

        # Create a dictionary to store predictions for each date and location
        predictions_by_date_location = defaultdict(lambda: defaultdict(list))

        # Get all predictions from the old Predictions model
        all_predictions = Predictions.objects.all()

        # Group predictions by date and location and store them in the predictions_by_date_location dictionary
        for prediction in all_predictions:
            date_key = (prediction.location_id, prediction.day, prediction.month, prediction.week_of_year)
            predictions_by_date_location[date_key]['predictions'].append(prediction.prediction)

        # Loop through the predictions_by_date_location dictionary and calculate the average prediction for each date and location
        for date_key, data in predictions_by_date_location.items():
            location_id, day, month, week_of_year = date_key
            predictions_for_date = data['predictions']
            average_prediction = sum(predictions_for_date) // len(predictions_for_date)

            # Create AggregatedPredictions object and save it
            aggregated_prediction_obj = AggregatedPredictions(
                location_id=location_id,
                day=day,
                month=month,
                week_of_year=week_of_year,
                average_prediction=average_prediction,
            )
            aggregated_prediction_obj.save()
        

        self.stdout.write(self.style.SUCCESS('AggregatedPredictions table has been populated.'))

        # Monthly Predicitions table

        MonthlyPredictions.objects.all().delete()

        # Create a dictionary to store predictions for each date and location
        predictions_by_date_location = defaultdict(lambda: defaultdict(list))

        # Get all predictions from the old Predictions model
        all_predictions = AggregatedPredictions.objects.all()

        # Group predictions by date and location and store them in the predictions_by_date_location dictionary
        for prediction in all_predictions:
            date_key = (prediction.location_id, prediction.month)
            predictions_by_date_location[date_key]['predictions'].append(prediction.average_prediction)

        # Loop through the predictions_by_date_location dictionary and calculate the average prediction for each date and location
        for date_key, data in predictions_by_date_location.items():
            location_id, month= date_key
            predictions_for_date = data['predictions']
            monthly_prediction = sum(predictions_for_date) // len(predictions_for_date)

        
        # Create AggregatedPredictions object and save it
            monthly_prediction_obj = MonthlyPredictions(
                location_id=location_id,
                month=month,
               # week_of_year=week_of_year,
                monthly_prediction=monthly_prediction,
            )
            monthly_prediction_obj.save()

        self.stdout.write(self.style.SUCCESS('MonthlyPredictions table has been populated.'))

        





