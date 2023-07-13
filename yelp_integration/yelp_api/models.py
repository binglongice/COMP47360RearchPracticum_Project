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

class Predictions(models.Model):
    location_id = models.BigIntegerField(primary_key=True)
    hour = models.BigIntegerField()
    day = models.BigIntegerField()
    month = models.BigIntegerField()
    week_of_month = models.BigIntegerField()
    normalised_prediction = models.FloatField()

    class Meta:
        db_table = 'predictions'

def __str__(self):
        return self.name
