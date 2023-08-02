import pytest
from yelp_api.tasks import calculate_and_cache_predictions


@pytest.mark.usefixtures('celery_worker_pool')
def test_calculate_and_cache_predictions(celery_app, django_settings):
    day = 1
    month = 8
    week_of_year = 30

    # Call the task using the Celery app
    result = calculate_and_cache_predictions.apply_async(args=[day, month, week_of_year], app=celery_app)
    
    # Check the result of the task
    assert result.successful()
    assert result.result == "Task completed successfully!"
