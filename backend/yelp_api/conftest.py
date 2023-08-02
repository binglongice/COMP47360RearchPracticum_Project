import pytest
import os
from celery import Celery
from django.test import override_settings
from yelp_api.tasks import calculate_and_cache_predictions

@pytest.fixture(scope='session')
def celery_app(request):
    app = Celery('tasks', broker='pyamqp://guest@localhost//', backend='rpc://')
    app.conf.task_always_eager = True  # Ensure tasks are executed synchronously during tests
    return app

@pytest.fixture(scope='session')
def celery_worker_pool(request):
    return 'solo'

@pytest.fixture(scope='session', autouse=True)
def django_settings():
    # Set the DJANGO_SETTINGS_MODULE environment variable
    os.environ['DJANGO_SETTINGS_MODULE'] = 'yelp_integration.settings'
    with override_settings(
        REDIS_HOST='localhost',
        REDIS_PORT=6379,
        REDIS_DB=0,
        # Add other settings as needed for your tests
    ):
        yield


@pytest.mark.usefixtures('celery_worker_pool', 'django_settings')
def test_calculate_and_cache_predictions(celery_app):
    day = 1
    month = 8
    week_of_year = 30

    # Call the task using the Celery app
    result = calculate_and_cache_predictions.apply_async(args=[day, month, week_of_year], app=celery_app)
    
    # Check the result of the task
    assert result.successful()
    assert result.result == "Task completed successfully!"
