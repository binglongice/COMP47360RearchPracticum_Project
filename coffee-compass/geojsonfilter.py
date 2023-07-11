import json

# # Load the GeoJSON file
# # with open('/Users/maxgirt/coffee-compass/public/NYC_Taxi_Zones.geojson') as file:
# #     data = json.load(file)

# # # Filter features based on the borough
# # filtered_features = [feature for feature in data['features'] if feature['properties']['borough'] == 'Manhattan']

# # # Extract zone names from the filtered features
# # zone_names = [feature['properties']['zone'] for feature in filtered_features]

# # # Create a new GeoJSON object with the filtered features
# # filtered_data = {
# #     'type': 'FeatureCollection',
# #     'features': filtered_features
# # }

# # # Save the filtered GeoJSON to a new file
# # with open('filtered_geojson_file.geojson', 'w') as file:
# #     json.dump(filtered_data, file)

# # Print the list of zone names
# # print(zone_names)
# # print(len(zone_names))




# import json
# file_path = '/Users/maxgirt/coffee-compass-project/coffee-compass/public/Subway_Entrances.geojson'
# import json

# def filter_manhattan_subway_stations(file_path):
#     with open(file_path) as file:
#         data = json.load(file)

#     filtered_data = []
#     for feature in data['features']:
#         coordinates = feature['geometry']['coordinates']
#         if -74.0479 <= coordinates[0] <= -73.9067 and 40.6829 <= coordinates[1] <= 40.8820:
#             filtered_data.append(feature)

#     filtered_geojson = {
#         'type': 'FeatureCollection',
#         'features': filtered_data
#     }

#     return filtered_geojson

# # Usage example
# filtered_geojson = filter_manhattan_subway_stations(file_path)

# # Save the filtered GeoJSON to a new file
# with open('Subway_Entrances.geojson', 'w') as file:
#     json.dump(filtered_geojson, file)


# Read the JSON file
with open('/Users/maxgirt/coffee-compass-project/coffee-compass/public/crimerate.json') as file:
    data = json.load(file)

# Extract neighborhoods
neighborhoods = [item[10] for item in data['data']]

# Count crimes in each neighborhood
crime_count = {}
for neighborhood in neighborhoods:
    if neighborhood not in crime_count:
        crime_count[neighborhood] = 1
    else:
        crime_count[neighborhood] += 1

# Print crime count in each neighborhood
for neighborhood, count in crime_count.items():
    print(f"Neighborhood: {neighborhood}, Crime Count: {count}")


# Max code to filter GeoJSON files