from django.db import models

# Cafe entity in a database

# Specifying the set up of the database table

class Cafe(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    #location = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    latitude = models.FloatField()
    longitude = models.FloatField()


#Specifying that the name of the table is cafe
class Meta:
        db_table = 'cafe'

def __str__(self):
        return self.name