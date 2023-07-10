from rest_framework import serializers
from .models import Cafe

# These are serialisers
# Serialisers are used to control the representation and structure of data in APIs, 
# ensure data integrity, and provide a standardized way of transmitting and consuming data


# The CafeSerializer class is a subclass of serializers.ModelSerializer. 
# It provides a serialization/deserialization mechanism for the Cafe model. 
# The fields of the Cafe model are specified as class attributes. 
# The address, longitude, and latitude fields are specified with custom source and formatting 
# options using the CharField and DecimalField serializers provided by Django REST Framework. 

class CafeSerializer(serializers.ModelSerializer):
    address = serializers.CharField(source='location.address1', allow_null=True, required=False)
    longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
    latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
    class Meta:
        model = Cafe
        fields = ['name', 'address', 'rating', 'longitude', 'latitude']

#Not being currently used

class Cafe_DB_Serializer(serializers.ModelSerializer):
    #address = serializers.CharField(source='location.address1', allow_null=True, required=False)
    #longitude = serializers.DecimalField(source='coordinates.longitude', max_digits=9, decimal_places=6, allow_null=True)
    #latitude = serializers.DecimalField(source='coordinates.latitude', max_digits=9, decimal_places=6, allow_null=True)
    class Meta:
        model = Cafe
        fields = ['name', 'address', 'rating', 'longitude', 'latitude']