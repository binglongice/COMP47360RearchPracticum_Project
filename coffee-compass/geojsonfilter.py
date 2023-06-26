import json

# Load the GeoJSON file
with open('/Users/maxgirt/coffee-compass/public/NYC_Taxi_Zones.geojson') as file:
    data = json.load(file)

# Filter features based on the borough
filtered_features = [feature for feature in data['features'] if feature['properties']['borough'] == 'Manhattan']

# Create a new GeoJSON object with the filtered features
filtered_data = {
    'type': 'FeatureCollection',
    'features': filtered_features
}

# Save the filtered GeoJSON to a new file
with open('filtered_geojson_file.geojson', 'w') as file:
    json.dump(filtered_data, file)
