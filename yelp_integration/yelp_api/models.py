from django.db import models

class Cafe(models.Model):
    id = models.CharField(primary_key=True,max_length=255)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    #location = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    latitude = models.FloatField()
    longitude = models.FloatField()

class Meta:
        db_table = 'cafe'

def __str__(self):
        return self.name