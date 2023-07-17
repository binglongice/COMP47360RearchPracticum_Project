import React, { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Navbar from './Navbar';
// import { fetchData } from '../api/Api';
import FilterNav from './FilterNav';
import { ApiContext } from '../context/ApiContext.js';
import CafeDrawer from './CafeDrawer';

mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';

function Map({ selectedIndex, onCafeSelection }) {
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const [data, setData, reviews, setReviews, picklePredictions, setPicklePredictions] = useContext(ApiContext);  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectRating,  setSelectedRating] = useState(null);
  useEffect(() => {
    console.log("Data changing:", data)
  }, [data]);
  

  //checks to see if the predictions load in
  // also removed the model_ text so that we have a hashmap where its just taxi_zone number : busyness value
  useEffect(() => {
    const predictions = Object.fromEntries(
      Object.entries(picklePredictions).map(([key, value]) => [key.replace("model_", ""), value])
    );
    console.log("pickles: ", predictions);
    // console.log("Pickles Pickles Pickles:", picklePredictions)
  }, [picklePredictions]);

        


  function getColorFromScore(score) {
    if (score === undefined) {
      return '#000000';
    }
    if (score < 0.1) {
      return '#00ff00';
    }
    if (score < 0.2) {
      return '#33ff00';
    }
    if (score < 0.3) {
      return '#66ff00';
    }
    if (score < 0.4) {
      return '#99ff00';
    }
    if (score < 0.5) {
      return '#ccff00';
    }
    if (score < 0.6) {
      return '#ffff00';
    }
    if (score < 0.7) {
      return '#ffcc00';
    }
    if (score < 0.8) {
      return '#ff9900';
    }
    if (score < 0.9) {
      return '#ff6600';
    }
    if (score < 1.0) {
      return '#ff3300';
    }
    if (score < 1.2) {
      return '#ffc000';
    }    
    return '#000000'; // Default color if none of the conditions match
  }
  
  useEffect(() => {
    if (picklePredictions) {
      const predictions = Object.fromEntries(
        Object.entries(picklePredictions).map(([key, value]) => [key.replace("model_", ""), value])
      );
  
    // Load GeoJSON data
    fetch('/filtered_geojson_file.geojson')
      .then(response => response.json())
      .then(geojsonData => {
        // Now we have the GeoJSON data
        if (map.current) {
          geojsonData.features.forEach(feature => {
            let objectid = feature.properties.objectid;
            let score = predictions[objectid];
            console.log("My objectid: ", objectid);
            console.log("My score: ", score);          
            feature.properties.color = getColorFromScore(score);
          });
  
          map.current.getSource('taxi_zones').setData(geojsonData);
  
          map.current.addLayer({
            id: 'taxi_zones_fill_map',
            type: 'fill',
            source: 'taxi_zones',
            paint: {
              'fill-color': ['get', 'color'],
              'fill-opacity': 0.5,
              'fill-outline-color': '#000000',
            }
          });
        }
      });
    }
  }, [picklePredictions]);  // Re-run effect whenever picklePredictions changes
                      
          

// console.log(myColorFunction(4));

  const [isLoading, setIsLoading] = useState(true);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-73.9712);
  const [lat, setLat] = useState(40.7831);
  const [zoom, setZoom] = useState(11.75);
  const [zonename, setName] = useState('');
  const taxiZones = ['/filtered_geojson_file.geojson'];

  // Set bounds for Manhattan, New York.
  const bounds = [
    [-74.255591, 40.477399], // Southwest coordinates
    [-73.698697, 40.983697] // Northeast coordinates
  ];
      // const [currentGeoJSONIndex, setCurrentGeoJSONIndex] = useState(0);
  const [currentGeoJSONIndex, setCurrentGeoJSONIndex] = useState(selectedIndex);

  useEffect(() => {
    console.log('Test to see if my data is correct:', data);
    if (data.length > 0) {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (!isLoading && data.length > 0) {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
      minZoom: zoom,
      maxBounds: bounds
      
    });

    map.current.on('style.load', () => {
      map.current.rotateTo(300);

      map.current.loadImage('/bench.png', (error, image) => {
        if (error) throw error;
        map.current.addImage('custom-marker', image);
    
      map.current.loadImage('/metro.png', (error, secondImage) => {
        if (error) throw error;
        map.current.addImage('custom-marker-2', secondImage);
          // Add a GeoJSON source with 2 points

      map.current.loadImage('/coffee.png', (error, fourthImage) => {
        if (error) throw error;
        map.current.addImage('custom-marker-4', fourthImage); 
    
      map.current.loadImage('/bus_stop.png', (error, thirdImage) => {
        if (error) throw error;
        map.current.addImage('custom-marker-3', thirdImage); 

        map.current.addSource('bench_locations', {
          type: 'geojson',
          data: '/City_Bench_Locations.geojson',
                  
        });
          
      map.current.addSource('taxi_zones', {
        type: 'geojson',
        data: '/filtered_geojson_file.geojson'      
      });

      map.current.addSource('subway', {
        type: 'geojson',
        data: '/Subway_Entrances.geojson'
      });

      map.current.addSource('bus', {
        type: 'geojson',
        data: '/Bus_Stop.geojson'
      });

    // Add the cafes data as a GeoJSON source
    map.current.addSource('cafes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: data.map((cafe) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [cafe.longitude, cafe.latitude],
          },
          properties: {
            name: cafe.name,
            address: cafe.address,
            rating: cafe.rating,
            id: cafe.id,
            image_url: cafe.image_url,
          },
        })),
      },
    });
  });
    });
  });
});
// Get the reference to the added source
// const taxiZonesSource = map.current.getSource('taxi_zones');

// // Load the busyness values into the taxi zones GeoJSON features
// if (taxiZonesSource) {
//   taxiZonesSource.on('data', () => {
//     const taxiZonesData = taxiZonesSource._data;

//     // Iterate over the taxi zone features
//     for (const feature of taxiZonesData.features) {
//       const taxiZoneModelNumber = feature.properties.objectid;
//       const busynessValue = picklePredictions[`model_${taxiZoneModelNumber}`] || 0;

//       // Add the busyness value to the properties of the feature
//       feature.properties.busyness = busynessValue;
//     }

//     // Update the taxi zones source data
//     taxiZonesSource.setData(taxiZonesData);
//   });
// }
// console.log("Taxi Zone Source:", taxiZonesSource);

// // Add the heatmap layer using the 'taxi_zones' source
// map.current.addLayer({
//   id: 'taxi_zones_heatmap',
//   type: 'heatmap',
//   source: 'taxi_zones',
//   paint: {
//     'heatmap-color': [
//       'interpolate',
//       ['linear'],
//       ['get', 'busyness'],
//       0, 'rgba(0, 0, 0, 0)',
//       0.1, '#20826c',
//       0.3, '#ffeb3b',
//       0.6, '#ff9800',
//       1, '#f44336',
//     ],
//     'heatmap-opacity': 0.8,
//     'heatmap-intensity': 1,
//     'heatmap-radius': 30,
//   },
// });

      // map.current.addLayer({
      //   id: 'taxi_zones_fill',
      //   type: 'fill',
      //   source: 'taxi_zones',
      //   paint: {
      //     'fill-color': '#20826c',
      //     'fill-opacity': 0.5,
      //     'fill-outline-color': '#000000',
      //   }
      // });


});

        
    // Create a popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.current.on('mouseenter', 'bench_locations_markers', (e) => {
      console.log("testtesttest");
      const bench = e.features[0].properties;
      const popupContent = `<strong>Address:</strong> ${bench.address}<br>` +
        `<strong>Category:</strong> ${bench.category}`;
      popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map.current);
    });
      
    // Handle mouseleave event on bench markers
    map.current.on('mouseleave', 'bench_locations_markers', () => {
      popup.remove();
    });


    map.current.on('mouseenter', 'cafe_markers', (e) => {
      const cafe = e.features[0].properties;
      const popupContent = `<strong>Name:</strong> ${cafe.name}<br>` +
        `<strong>Address:</strong> ${cafe.address}<br>` +
        `<strong>Rating:</strong> ${cafe.rating}`;
      popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map.current);
    });
    
    // Handle mouseleave event on cafe markers
    map.current.on('mouseleave', 'cafe_markers', () => {
      popup.remove();
    });

    // Close the popup when the map is clicked
    map.current.on('click', () => {
      popup.remove();
    });
    // Add mouseenter event listener to change zone color on hover
    map.current.on('mousemove', 'taxi_zones_fill', (e) => {
      const hoveredZone = e.features[0].properties.objectid; // Get the ID of the hovered zone
      const zoneName = e.features[0].properties.zone;

      // Change fill color only for the hovered zone
      map.current.setPaintProperty('taxi_zones_fill', 'fill-color', [
        'match',
        ['get', 'objectid'],
        hoveredZone,
        '#00ff00', // Color for the hovered zone
        '#20826c' // Default color for other zones
      ]);

      // Update the name state with the zone name
      setName(zoneName);
    });

    // Add mouseleave event listener to reset zone color when not hovering
    map.current.on('mouseleave', 'taxi_zones_fill', () => {
      map.current.setPaintProperty('taxi_zones_fill', 'fill-color', '#20826c'); // Reset fill color for last zone
      setName(''); // Clear the name state
    });

    map.current.on('click', 'taxi_zones_fill', (e) => {
      const lngLat = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat
      };
      map.current.flyTo({ center: lngLat, zoom: 14 }); // Zoom in to the clicked point
    });

    map.current.on('click', 'cafe_markers', (e) => {
      const cafe_id = e.features[0].properties.id;
      const cafe_url = e.features[0].properties.image_url;
      const cafe_name = e.features[0].properties.name;
      const cafe_rating = e.features[0].properties.rating
      console.log(cafe_id);
      setSelectedCafeId(cafe_id);
      setSelectedImage(cafe_url)
      setSelectedName(cafe_name)
      setSelectedRating(cafe_rating)
      onCafeSelection(cafe_id);
    });


  };
  }, [isLoading, data, lng, lat, zoom, bounds]); //This is the useEffect dependency array
  //When any of the variables or states listed in the dependency array above change, the effect will run again.
  

//Pass in active buttons from FilterNav to affect the layers

  const handleLayerChange = (activeButtons) => {
    setCurrentGeoJSONIndex(activeButtons);
  // Remove existing layers
  map.current.getStyle().layers.forEach((layer) => {
    if (
      layer.id === 'bench_locations_markers' ||
      layer.id === 'subway_markers' ||
      layer.id === 'bus_markers' ||
      layer.id === 'cafe_markers' ||
      layer.id === 'taxi_zones_fill'
    ) {
      map.current.removeLayer(layer.id);
    }
  });
  
  //if 0 (taxi button) then add in taxi zones as an overlay on the map
    if (activeButtons.includes(0)) {
      map.current.getSource('taxi_zones').setData('/filtered_geojson_file.geojson');
      map.current.addLayer({
        id: 'taxi_zones_fill',
        type: 'fill',
        source: 'taxi_zones',
        paint: {
          'fill-color': '#20826c',
          'fill-opacity': 0.5,
          'fill-outline-color': '#000000',
        }
      });
    }
    if (activeButtons.includes(1)) {
      map.current.getSource('bench_locations').setData('/City_Bench_Locations.geojson');
      
      const filterExpression = ['==', ['get', 'borough'], 'Manhattan'];
      map.current.addLayer({
        id: 'bench_locations_markers',
        type: 'symbol',
        source: 'bench_locations',
        layout: {
          'icon-image': 'custom-marker',
          'icon-size': 0.5,
        },
        filter: filterExpression,
      });
    }
  
    if (activeButtons.includes(2)) {
      map.current.addLayer({
        id: 'subway_markers',
        type: 'symbol',
        source: 'subway',
        layout: {
          'icon-image': 'custom-marker-2',
          'icon-size': 0.3,
        },
      });
    }
  
    if (activeButtons.includes(3)) {
      map.current.addLayer({
        id: 'bus_markers',
        type: 'symbol',
        source: 'bus',
        layout: {
          'icon-image': 'custom-marker-3',
          'icon-size': 0.7,
        },
        filter: ['==', 'boro_name', 'Manhattan'],
      });
    }
    if (activeButtons.includes(4)) {
      map.current.addLayer({
        id: 'cafe_markers',
        type: 'symbol',
        source: 'cafes',
        layout: {
          'icon-image': 'custom-marker-4',
          'icon-size': 0.7,
        }
      });
    }

  };  
  const lnglat =  {lng: -73.9712, lat:40.7831};
  const handleReset = () => {
    map.current.flyTo({ center: lnglat, zoom: 11.75 }); // 
  };

  return (
    <div>
      {/* Render the name element */}
      <Navbar name = {zonename} />
      <button onClick={handleReset}>Reset</button>
      <CafeDrawer cafeId={selectedCafeId} cafe_url = {selectedImage}  cafe_name = {selectedName} cafe_rating = {selectRating}/>
            {/* Map container */}
      <div ref={mapContainer} className="map-container">
      </div>
      <div className="filter-nav-container">
      <FilterNav handleLayerChange={handleLayerChange} />
    </div>
    </div>
  );
}

export default Map;
