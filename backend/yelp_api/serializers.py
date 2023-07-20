from rest_framework import serializers
from .models import Cafe
from .models import Predictions


class CafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']

class Cafe_DB_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']


#this is new 
class PredictionsSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Predictions
        fields = ['location_id', 'hour', 'day','month', 'week_of_month', 'normalized_prediction']
    