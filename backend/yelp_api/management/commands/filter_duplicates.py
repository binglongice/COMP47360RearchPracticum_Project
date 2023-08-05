from django.core.management.base import BaseCommand
from yelp_api.models import Bars, Restaurants, Cafe
from collections import  Counter


class Command(BaseCommand):
    help = 'Delete the duplicates.'


    def handle(self, *args, **kwargs):

        # Get all entries from Bars and Cafe models
        bars_entries = Bars.objects.all()
        cafe_entries = Cafe.objects.all()

        # Extract unique identifiers (primary keys) from each queryset
        bars_ids = set(bars_entries.values_list('id', flat=True))
        cafe_ids = set(cafe_entries.values_list('id', flat=True))

        # Find overlapping entries by calculating the intersection of the two sets
        overlapping_entries = bars_ids.intersection(cafe_ids)

        # Print the number of overlapping entries
        print("Number of overlapping entries between Bars and Cafe:", len(overlapping_entries))

        # Delete the overlapping entries from both models
        Bars.objects.filter(id__in=overlapping_entries).delete()
        #Cafe.objects.filter(id__in=overlapping_entries).delete()

        # Optional: Print the number of deleted entries
        print("Number of overlapping entries deleted:", len(overlapping_entries))




        # Get all entries from Bars and Cafe models
        restaurants_entries = Restaurants.objects.all()
        cafe_entries = Cafe.objects.all()

        # Extract unique identifiers (primary keys) from each queryset
        restaurants_ids = set(restaurants_entries.values_list('id', flat=True))
        cafe_ids = set(cafe_entries.values_list('id', flat=True))

        # Find overlapping entries by calculating the intersection of the two sets
        overlapping_entries = restaurants_ids.intersection(cafe_ids)

        # Print the number of overlapping entries
        print("Number of overlapping entries between Restaurants and Cafe:", len(overlapping_entries))

        # Delete the overlapping entries from both models
        Restaurants.objects.filter(id__in=overlapping_entries).delete()
        #Cafe.objects.filter(id__in=overlapping_entries).delete()

        # Optional: Print the number of deleted entries
        print("Number of overlapping entries deleted:", len(overlapping_entries))








        # Get all entries from Bars and Cafe models
        bars_entries = Bars.objects.all()
        restaurants_entries = Restaurants.objects.all()

        # Extract unique identifiers (primary keys) from each queryset
        restaurants_ids = set(restaurants_entries.values_list('id', flat=True))
        cafe_ids = set(cafe_entries.values_list('id', flat=True))

        # Find overlapping entries by calculating the intersection of the two sets
        overlapping_entries = bars_ids.intersection(restaurants_ids)

        # Print the number of overlapping entries
        print("Number of overlapping entries between Bars and Restaurants:", len(overlapping_entries))


        # Delete the overlapping entries from both models
        Bars.objects.filter(id__in=overlapping_entries).delete()
        #Cafe.objects.filter(id__in=overlapping_entries).delete()

        # Optional: Print the number of deleted entries
        print("Number of overlapping entries deleted:", len(overlapping_entries))


        self.stdout.write(self.style.SUCCESS('Tables have been filtered.'))



                
                
                
        # Get all entries from Bars, Cafe and Restaurant models
        entries = list(Bars.objects.all()) + list(Cafe.objects.all()) + list(Restaurants.objects.all())



        # Extract unique identifiers (primary keys) from the queryset
        entries_ids = [entry.id for entry in entries]

        # Count the occurrences of each entry's identifier
        id_counts = Counter(entries_ids)


        # Find overlapping entries by calculating the intersection of the two sets
        overlapping_entries = [entry_id for entry_id, count in id_counts.items() if count > 1]

        # Print the number of overlapping entries
        print("Number of overlapping entries between Bars, Cafe and Restaurants:", len(overlapping_entries))