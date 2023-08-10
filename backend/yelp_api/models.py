from django.db import models

class Cafe(models.Model):
    id = models.CharField(primary_key=True,max_length=255)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image_url = models.CharField(max_length=255, null=True)

    class Meta:
       db_table = 'cafe'

    def __str__(self):
        return self.name


class Bars(models.Model):
    id = models.CharField(primary_key=True,max_length=255)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image_url = models.CharField(max_length=255, null=True)

    class Meta:
       db_table = 'bars'




class Restaurants(models.Model):
    id = models.CharField(primary_key=True,max_length=255)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image_url = models.CharField(max_length=255, null=True)




    class Meta:
       db_table = 'restaurants'

class Predictions(models.Model):
    location_id = models.BigIntegerField(primary_key=True)
    hour = models.BigIntegerField()
    day = models.BigIntegerField()
    month = models.BigIntegerField()
    week_of_year = models.BigIntegerField()
    prediction = models.BigIntegerField(null = True)
    datetime = models.DateTimeField(null=True)

    class Meta:
        db_table = 'predictions'



class AggregatedPredictions(models.Model):
    location_id = models.BigIntegerField()
    day = models.BigIntegerField()
    month = models.BigIntegerField()
    week_of_year = models.BigIntegerField(null=True)
    average_prediction = models.BigIntegerField()

    class Meta:
        db_table = 'aggregated_predictions'


class MonthlyPredictions(models.Model):
    location_id = models.BigIntegerField()
    month = models.BigIntegerField()
  #  week_of_year = models.BigIntegerField(null=True)
    monthly_prediction = models.BigIntegerField()

    class Meta:
        db_table = 'monthly_predictions'

