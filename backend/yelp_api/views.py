from django.shortcuts import render
from django.http import JsonResponse
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .api import search_cafes, search_bars, search_restaurants, get_reviews
from .models import Cafe, Bars, Restaurants
from .models import Predictions
#from yelp_integration import search_cafes
from .serializers import CafeSerializer, Cafe_DB_Serializer
from .serializers import RestaurantsSerializer, Restaurants_DB_Serializer
from .serializers import PredictionsSerializer, Bars_DB_Serializer, BarsSerializer
from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination
import redis
from django.conf import settings
import redis
import json
from datetime import date
from collections import Counter 


REDIS_HOST = '127.0.0.1'
REDIS_PORT = '6379'

@api_view(['GET'])
def predictions_api(request, location):
    # Retrieve predictions from the database
    predictions_list = Predictions.objects.all()

    # Configure pagination
    paginator = Paginator(predictions_list, 100)  # Adjust the page size as needed
    page = request.GET.get('page')
    predictions_page = paginator.get_page(page)

    # Serialize the paginated data
    serializer = PredictionsSerializer(predictions_page, many=True)

    # Return paginated response
    return Response({
        'count': paginator.count,
        'num_pages': paginator.num_pages,
        'results': serializer.data
    })


@api_view(['GET'])
def cafes_api(request, location):
    try:
        redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

        # Create a key with Yelp API and current date
        redis_key = f"Yelp_API:{date.today()}:{location}, cafes"

        # Check if the data is already cached in Redis
        cached_data = redis_client.get(redis_key)

        if cached_data:
            # If the data is cached in Redis, retrieve and return it
            cafes_list = json.loads(cached_data)
            print("Yelp API Data read from Redis.")
            serializer = Cafe_DB_Serializer(cafes_list, many=True)
            return Response(serializer.data)

        if Cafe.objects.count() >= 1:
            cafes_list = Cafe.objects.all()
            serializer = Cafe_DB_Serializer(cafes_list, many=True)
            print(Cafe.objects.count(), "cafes.")

            # Store the data in Redis with the specified key for future use
            redis_client.set(redis_key, json.dumps(serializer.data))
            print("Yelp API Data stored in Redis from the database.")
            return Response(serializer.data)

        print("Making Yelp API call to fetch the data.")
        cafes = Cafe.objects.all()
        print("Cafes in database", cafes.count())

        limit = 50
        offset = 0
        total_cafes = 0
        cafes_list = []

        while total_cafes < 1000:
            data = search_cafes(location, offset=offset)
            businesses = data.get('businesses', [])
            cafes_list.extend(businesses)
            total_cafes += len(businesses)
            offset += limit
            
            if len(businesses) < limit:
                break
        
        print('populated db with cafes up to limit')

        Cafe.objects.all().delete()

        for cafe_data in cafes_list:
            cafe = Cafe(
                id=cafe_data['id'],
                name=cafe_data['name'],
                address=cafe_data['location']['address1'],
                rating=cafe_data['rating'],
                latitude=cafe_data['coordinates']['latitude'],
                longitude=cafe_data['coordinates']['longitude'],
                image_url=cafe_data['image_url'],
            )

            cafe.save()

        serializer = CafeSerializer(cafes_list, many=True)

        # Store the data in Redis with the specified key for future use
        redis_client.set(redis_key, json.dumps(serializer.data))
        print("Yelp API Data stored in Redis from the API call.")
        
        return Response(serializer.data)

    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache - when trying to get cafe info")
        try:
            # Attempt to read from the database if the Redis cache is unavailable
            cafes_list = Cafe.objects.all()
            serializer = Cafe_DB_Serializer(cafes_list, many=True)
            return Response(serializer.data)

        except Exception as e:
            # Handle database connection error gracefully
            print("Error: Unable to connect to the database - - when trying to get cafe info")
            return Response({"error": "Unable to connect to the cache and database"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


@api_view(['GET'])
def bars_api(request, location):
    try:
        redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

        # Create a key with Yelp API and current date
        redis_key = f"Yelp_API:{date.today()}:{location}, bars"

        # Check if the data is already cached in Redis
        cached_data = redis_client.get(redis_key)

        if cached_data:
            # If the data is cached in Redis, retrieve and return it
            bars_list = json.loads(cached_data)
            print("Yelp API Data read from Redis.")
            serializer = Bars_DB_Serializer(bars_list, many=True)
            return Response(serializer.data)

        if Bars.objects.count() >= 1:
            bars_list = Bars.objects.all()
            serializer = Bars_DB_Serializer(bars_list, many=True)
            print(Bars.objects.count(), "bars.")

            # Store the data in Redis with the specified key for future use
            redis_client.set(redis_key, json.dumps(serializer.data))
            print("Yelp API Data stored in Redis from the database.")
            return Response(serializer.data)

        print("Making Yelp API call to fetch the data.")
        bars = Bars.objects.all()
        print("Bars in database", bars.count())

        limit = 50
        offset = 0
        total_bars = 0
        bars_list = []

        while total_bars < 1000:
            data = search_bars(location, offset=offset)
            businesses = data.get('businesses', [])
            bars_list.extend(businesses)
            total_bars += len(businesses)
            offset += limit
            
            if len(businesses) < limit:
                break
        
        print('populated db with bars up to limit')

        Bars.objects.all().delete()

        for bars_data in bars_list:
            bars = Bars(
                id=bars_data['id'],
                name=bars_data['name'],
                address=bars_data['location']['address1'],
                rating=bars_data['rating'],
                latitude=bars_data['coordinates']['latitude'],
                longitude=bars_data['coordinates']['longitude'],
                image_url=bars_data['image_url'],
            )

            bars.save()

        serializer = BarsSerializer(bars_list, many=True)
        
        return Response(serializer.data)

    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache - when trying to get cafe info")
        try:
            # Attempt to read from the database if the Redis cache is unavailable
            bars_list = Bars.objects.all()
            serializer = Bars_DB_Serializer(bars_list, many=True)
            return Response(serializer.data)

        except Exception as e:
            # Handle database connection error gracefully
            print("Error: Unable to connect to the database - - when trying to get cafe info")
            return Response({"error": "Unable to connect to the cache and database"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        





@api_view(['GET'])
def restaurants_api(request, location):
    try:
        redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB)

        # Create a key with Yelp API and current date
        redis_key = f"Yelp_API:{date.today()}:{location}, restaurants"

        # Check if the data is already cached in Redis
        cached_data = redis_client.get(redis_key)

        if cached_data:
            # If the data is cached in Redis, retrieve and return it
            restaurants_list = json.loads(cached_data)
            print("Yelp API Data read from Redis.")
            serializer = Restaurants_DB_Serializer(restaurants_list, many=True)
            return Response(serializer.data)

        if Restaurants.objects.count() >= 1:
            restaurants_list = Restaurants.objects.all()
            serializer = Restaurants_DB_Serializer(restaurants_list, many=True)
            print(Restaurants.objects.count(), "restaurants.")

            # Store the data in Redis with the specified key for future use
            redis_client.set(redis_key, json.dumps(serializer.data))
            print("Yelp API Data stored in Redis from the database.")
            return Response(serializer.data)

        print("Making Yelp API call to fetch the data.")
        restaurants = Restaurants.objects.all()
        print("Restaurants in database", restaurants.count())

        limit = 50
        offset = 0
        total_restaurants = 0
        restaurants_list = []

        while total_restaurants < 1000:
            data = search_restaurants(location, offset=offset)
            businesses = data.get('businesses', [])
            restaurants_list.extend(businesses)
            total_restaurants += len(businesses)
            offset += limit
            
            if len(businesses) < limit:
                break
        
        print('populated db with restaurants up to limit')

        Restaurants.objects.all().delete()

        for restaurants_data in restaurants_list:
            restaurants = Restaurants(
                id=restaurants_data['id'],
                name=restaurants_data['name'],
                address=restaurants_data['location']['address1'],
                rating=restaurants_data['rating'],
                latitude=restaurants_data['coordinates']['latitude'],
                longitude=restaurants_data['coordinates']['longitude'],
                image_url=restaurants_data['image_url'],
            )

            restaurants.save()

        serializer = RestaurantsSerializer(restaurants_list, many=True)

        # Store the data in Redis with the specified key for future use
        redis_client.set(redis_key, json.dumps(serializer.data))
        print("Yelp API Data stored in Redis from the API call.")




        
        return Response(serializer.data)

    except redis.ConnectionError:
        # Handle Redis connection error gracefully
        print("Error: Unable to connect to the Redis cache - when trying to get cafe info")
        try:
            # Attempt to read from the database if the Redis cache is unavailable
            restaurants_list = Restaurants.objects.all()
            serializer = Restaurants_DB_Serializer(restaurants_list, many=True)
            return Response(serializer.data)

        except Exception as e:
            # Handle database connection error gracefully
            print("Error: Unable to connect to the database - - when trying to get restaurant info")
            return Response({"error": "Unable to connect to the cache and database"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        








@api_view(['GET'])
def review_api(requests, id):
    data = get_reviews(id)
    return Response(data)
