from django.shortcuts import render
from django.http import JsonResponse
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .api import search_cafes, get_reviews
from .models import Cafe
from .models import Predictions
#from yelp_integration import search_cafes
from .serializers import CafeSerializer
from .serializers import Cafe_DB_Serializer
from .serializers import PredictionsSerializer
from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination
import redis
from django.conf import settings
import redis
import json
from datetime import date


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
        redis_key = f"Yelp_API:{date.today()}:{location}"

        # Check if the data is already cached in Redis
        cached_data = redis_client.get(redis_key)

        if cached_data:
            # If the data is cached in Redis, retrieve and return it
            cafes_list = json.loads(cached_data)
            print("Yelp API Data read from Redis.")
            serializer = Cafe_DB_Serializer(cafes_list, many=True)
            return Response(serializer.data)

        if Cafe.objects.count() == 1000:
            cafes_list = Cafe.objects.all()
            serializer = Cafe_DB_Serializer(cafes_list, many=True)

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
def review_api(requests, id):
    data = get_reviews(id)
    return Response(data)
