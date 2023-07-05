import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Navbar from './Navbar';
import { getCafesByLocation } from '../api/api';
import FilterNav from './FilterNav'



mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';

function Map({ selectedIndex }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-73.9712);
  const [lat, setLat] = useState(40.7831);
  const [zoom, setZoom] = useState(11.75);
  const [zonename, setName] = useState('');
  const geoJSONFiles = [
    '/filtered_geojson_file.geojson',
    '/City_Bench_Locations.geojson',
    '/Subway_Entrances.geojson',
    '/Bus_Stop.geojson',
  ];
  // Set bounds for Manhattan, New York.
  const bounds = [
    [-74.255591, 40.477399], // Southwest coordinates
    [-73.698697, 40.983697] // Northeast coordinates
  ];
      // const [currentGeoJSONIndex, setCurrentGeoJSONIndex] = useState(0);
  const [currentGeoJSONIndex, setCurrentGeoJSONIndex] = useState(selectedIndex);

  // useEffect(() => {
  //   // Update map layer and markers when selectedIndex changes
  //   handleLayerChange(selectedIndex);
  // }, [selectedIndex]);



  // const handleLayerChange = (index) => {
  //   setCurrentGeoJSONIndex(index);
  //   map.current.getSource('bench_locations').setData(geoJSONFiles[index]);
  //   map.current.getSource('taxi_zones').setData(geoJSONFiles[index]);

  //   if (index===0){
  //         map.current.removeLayer('bench_locations_markers');
  //         map.current.removeLayer('subway_markers');
  //         map.current.removeLayer('bus_markers');
  //   } else if (index===1) {
  //       const filterExpression = ['==', ['get', 'borough'], 'Manhattan'];
  //       map.current.addLayer({
  //       id: 'bench_locations_markers',
  //       type: 'symbol',
  //       source: 'bench_locations',
  //       layout: {
  //         'icon-image': 'custom-marker',
  //         'icon-size': 0.5,
  //       },
  //       filter: filterExpression
  //     });
  //   } else if (newIndex===2) {
  //       map.current.removeLayer('bench_locations_markers');
  //       map.current.addLayer({
  //       id: 'subway_markers',
  //       type: 'symbol',
  //       source: "subway",
  //       layout: {
  //         'icon-image': 'custom-marker-2',
  //         'icon-size': 0.3,
  //       },
  //     })
  //   } else if (newIndex===3) {
  //     map.current.removeLayer('subway_markers');
  //     map.current.addLayer({
  //       id: 'bus_markers',
  //       type: 'symbol',
  //       source: 'bus',
  //       layout: {
  //         'icon-image': 'custom-marker-3',
  //         'icon-size': 0.7,
  //       },
  //       filter: ['==', 'boro_name', 'Manhattan']  // Add the filter condition here

  //     })

  //   }

  // };

    
    




  










  // // Function to handle the button click event
  // const handleButtonClick = () => {
  //   const newIndex = (currentGeoJSONIndex + 1) % 4; // Iterate up to 4
  //   setCurrentGeoJSONIndex(newIndex);
  //   map.current.getSource('bench_locations').setData(geoJSONFiles[newIndex]);
  //   map.current.getSource('taxi_zones').setData(geoJSONFiles[newIndex]); 

  //   //the logic for adding the bench layer has to be inside this function otherwise both layers will load by default
  //   if (newIndex === 0) {
  //     map.current.removeLayer('bench_locations_markers');
  //     map.current.removeLayer('subway_markers');
  //     map.current.removeLayer('bus_markers');


  //   } else if (newIndex===1) {
  //     const filterExpression = ['==', ['get', 'borough'], 'Manhattan'];
  //     map.current.addLayer({
  //       id: 'bench_locations_markers',
  //       type: 'symbol',
  //       source: 'bench_locations',
  //       layout: {
  //         'icon-image': 'custom-marker',
  //         'icon-size': 0.5,
  //       },
  //       filter: filterExpression
  //     });
  //   } else if (newIndex===2) {
  //     map.current.removeLayer('bench_locations_markers');
  //       map.current.addLayer({
  //       id: 'subway_markers',
  //       type: 'symbol',
  //       source: "subway",
  //       layout: {
  //         'icon-image': 'custom-marker-2',
  //         'icon-size': 0.3,
  //       },
  //     })
  //   } else if (newIndex===3) {
  //     map.current.removeLayer('subway_markers');
  //     map.current.addLayer({
  //       id: 'bus_markers',
  //       type: 'symbol',
  //       source: 'bus',
  //       layout: {
  //         'icon-image': 'custom-marker-3',
  //         'icon-size': 0.7,
  //       },
  //       filter: ['==', 'boro_name', 'Manhattan']  // Add the filter condition here

  //     })

  //   }

  // };



  useEffect(() => {
    
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

      map.current.loadImage('/bus_stop.png', (error, thirdImage) => {
        if (error) throw error;
        map.current.addImage('custom-marker-3', thirdImage); 


          

        map.current.addSource('bench_locations', {
          type: 'geojson',
          data: geoJSONFiles[currentGeoJSONIndex]                  
        });
          
      
  


      map.current.addSource('taxi_zones', {
        type: 'geojson',
        data: geoJSONFiles[currentGeoJSONIndex]      
      });

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

      map.current.addSource('subway', {
        type: 'geojson',
        data: '/Subway_Entrances.geojson'
      });

      map.current.addSource('bus', {
        type: 'geojson',
        data: '/Bus_Stop.geojson'
      });


    });
  });
});
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
  }, []);

  const handleLayerChange = (activeButtons) => {
    setCurrentGeoJSONIndex(activeButtons);
    // map.current.getSource('bench_locations').setData(geoJSONFiles[activeButtons]);
    // map.current.getSource('taxi_zones').setData(geoJSONFiles[activeButtons]);
  
    // Remove layers that are no longer needed
    map.current.removeLayer('taxi_zones_fill');
    map.current.removeLayer('bench_locations_markers');
    map.current.removeLayer('subway_markers');
    map.current.removeLayer('bus_markers');
  
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
  };
  
  

  

  

  return (
    <div>
      {/* Render the name element */}
      {/* {name && <div className="nameElement">{name}</div>} */}
      <Navbar name = {zonename} />
      <button onClick={getCafesByLocation}>test</button>
      {/* Map container */}
      {/* <button onClick={handleButtonClick} id="switchButton">Switch GeoJSON</button> */}
      <div ref={mapContainer} className="map-container" />
      <div className="filter-nav-container">
      <FilterNav handleLayerChange={handleLayerChange} />
    </div>
    </div>
  );
}

export default Map;
