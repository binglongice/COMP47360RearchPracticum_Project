from django.apps import AppConfig

#Django application configuration file

#Creating custom application configuration class

class YelpApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "yelp_api"
