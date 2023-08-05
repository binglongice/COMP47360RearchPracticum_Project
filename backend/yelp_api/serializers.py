from rest_framework import serializers
from .models import Cafe
from .models import Predictions, AggregatedPredictions
from .models import Bars, Restaurants

# class CafeSerializer(serializers.ModelSerializer):
#     address = serializers.CharField(source='location.address1', allow_null=True, required=False)
#     longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
#     latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
#     class Meta:
#         model = Cafe
#         fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']

# class Cafe_DB_Serializer(serializers.ModelSerializer):
#     address = serializers.CharField(source='location.address1', allow_null=True, required=False)
#     longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
#     latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
#     class Meta:
#         model = Cafe
#         fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']


class CafeSerializer(serializers.ModelSerializer):
        address = serializers.CharField(source='location.address1', allow_null=True, required=False)
        longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
        latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
        class Meta:

         model = Cafe
         fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']

class Cafe_DB_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']


class BarsSerializer(serializers.ModelSerializer):
        address = serializers.CharField(source='location.address1', allow_null=True, required=False)
        longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
        latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
        class Meta:

         model = Cafe
         fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']

class Bars_DB_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']


class RestaurantsSerializer(serializers.ModelSerializer):
        address = serializers.CharField(source='location.address1', allow_null=True, required=False)
        longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
        latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
        class Meta:

         model = Cafe
         fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']

class Restaurants_DB_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = ['id','name', 'address', 'rating', 'longitude', 'latitude', 'image_url']




#this is new 
class PredictionsSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Predictions
        fields = ['location_id', 'hour', 'day','month', 'week_of_month', 'normalized_prediction']

class AggregatedPredictionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AggregatedPredictions
        fields = ['location_id','day', 'month', 'week_of_year', 'average_prediction']
    