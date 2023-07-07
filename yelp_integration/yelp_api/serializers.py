from rest_framework import serializers
from .models import Cafe

class CafeSerializer(serializers.ModelSerializer):
    address = serializers.CharField(source='location.address1', allow_null=True, required=False)
    longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
    latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
    class Meta:
        model = Cafe
        fields = ['name', 'address', 'rating', 'longitude', 'latitude']

class Cafe_DB_Serializer(serializers.ModelSerializer):
    #address = serializers.CharField(source='location.address1', allow_null=True, required=False)
    #longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
    #latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
    class Meta:
        model = Cafe
        fields = ['name', 'address', 'rating', 'longitude', 'latitude']
