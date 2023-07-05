import geopandas as gpd

# Load the GeoJSON file
file_path = "C:/Users/fu/Documents/NYC_Taxi_Zones.geojson"
gdf = gpd.read_file(file_path)

# Filter for Manhattan zones
manhattan_zones = gdf[gdf['borough'] == 'Manhattan']

# Save the filtered data to a new GeoJSON file
output_file = "C:/Users/fu/Documents/manhattan_zones.geojson"
manhattan_zones.to_file(output_file, driver='GeoJSON')
