import React, { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl'; 
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Navbar from './Navbar';
// import { fetchData } from '../api/Api';
import FilterNav from './FilterNav';
import { ApiContext } from '../context/ApiContext.js';
import CafeDrawer from './CafeDrawer';
import Legend from './Legend';
import HeatMapBox from './HeatMapBox';
import TakeOutBox from './TakeOutBox';
import MapContext from '../context/MapContext';
import BusynessSlider from './BusynessSlider';
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';

function Map({ selectedIndex, onCafeSelection }) {

  const getHour = () => {
    const today = new Date();
    return today.getHours();
  }



  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const [data, setData, reviews, setReviews, picklePredictions, setPicklePredictions, yearData, setYearData, weekData, setWeekData] = useContext(ApiContext);  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [mapIsCurrent, setmapIsCurrent] = useState(false);

  const [selectRating,  setSelectedRating] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null); //we need to store the geoJson data in state so that we can use it outside where its defined 
  const [predictionsData, setPredictions] = useState(null); //we need to store the predictions ... 
  const [isButton5Active, setIsButton5Active] = useState(true); //render the heatmap legend or not
  const [prices, setPrices] = useState(null); //we need to store the prices ...
  const [priceGeoJsonData, setPriceGeoJsonData] = useState(null); //we need to store the prices ...
  const [busyness, setBusynessData] = useState(null); 
  const [crimeData, setCrimeData] = useState(null);
  const [rankedData, setRankedData] = useState(null);
  // const [isRankLoaded, setIsRankLoaded] = useState(false);
  const [rankedGeoJson, setRankGeojsonData] = useState(null);
  const [activeMaps, setActiveMaps] = useState(null);
  const[newGeoJson, setNewGeoJson] = useState(null);
  const [transportData, setTransportData] = useState(null);
  const [hour, setHour] = useState(getHour());
  const [weekRankData, setWeekRankData] = useState(null);
  const [yearRankData, setYearRankData] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('day');
//takes in the json objects for busyness prices and crime
//returns a json object with the objectid as the key and the rank as the value
//assigns rank to each feature and creates a combined rank and current rank
//the current rank is updated after each filter is applied via activeMaps
//combined rank is updated if busyness data is changed
  useEffect(() => {
    if (selectedTimeFrame && prices && crimeData && transportData) {
      let rankedData = {
        "busyness": {},
        "prices": {},
        "crimeData": {},
        "transportData": {},
        "combined": {},
        "current": {},
      };
      //depending on the value of busyness Data we will switch the data that we use to rank busyness
      let busynessData;
      switch(selectedTimeFrame) {
        case 'day':
          busynessData = busyness;
          break;
        case 'week':
          busynessData = weekRankData;
          break;
        case 'year':
          busynessData = yearRankData;
          break;
        default:
          busynessData = busyness;
      }
      console.log("This is busynessData as it switches!: ", busynessData);
  
      let sortedKeysBusyness = Object.keys(busynessData).sort((a, b) => busynessData[b][hour] - busynessData[a][hour]);
      let sortedKeysPrices = Object.keys(prices).sort((a, b) => prices[b] - prices[a]);
      let sortedKeysCrime = Object.keys(crimeData).sort((a, b) => crimeData[b] - crimeData[a]); //sort so that zone with lowest crime is first
      let sortedKeysTransport = Object.keys(transportData).sort((a, b) => transportData[b] - transportData[a]); 
      let combined = {};
      let current = {};
  
      for (let rank = 0; rank < sortedKeysBusyness.length; rank++) {
        let objectid = sortedKeysBusyness[rank];
        rankedData.busyness[objectid] = { score: busyness[objectid], rank: rank + 1 };
  
        // Initialize combined rank with busyness rank
        combined[objectid] = { rank: rank + 1 };
      }
  
      for (let rank = 0; rank < sortedKeysPrices.length; rank++) {
        let objectid = sortedKeysPrices[rank];
        rankedData.prices[objectid] = { score: prices[objectid], rank: rank + 1 };
  
        // Add prices rank to combined rank
        combined[objectid].rank += rank + 1;
      }
  
      for (let rank = 0; rank < sortedKeysCrime.length; rank++) {
        let objectid = sortedKeysCrime[rank];
        rankedData.crimeData[objectid] = { score: crimeData[objectid], rank: rank + 1 };
  
        // Add crimeData rank to combined rank
        combined[objectid].rank += rank + 1;
      }

      for (let rank = 0; rank < sortedKeysTransport.length; rank++) {
        let objectid = sortedKeysTransport[rank];
        rankedData.transportData[objectid] = { score: transportData[objectid], rank: rank + 1 };
  
        // Add transport rank to combined rank
        combined[objectid].rank += rank + 1;
      }
  
      // Sort combined data and assign ranks
      // The ranks are all added together, so the lowest combined rank is the best
      //currently there is no logic to handle if combined scores are the same, they simply have the same combined rank
      let sortedCombined = Object.entries(combined).sort((a, b) => a[1].rank - b[1].rank);
      for (let rank = 0; rank < sortedCombined.length; rank++) {
        let [objectid] = sortedCombined[rank];
        rankedData.combined[objectid] = { rank: rank + 1 };
      }
      if (activeMaps) {
        const activeCount = Object.values(activeMaps).filter(val => val).length;
      
        if (activeCount > 1) {
          // Initialize current
          rankedData.current = {};
          const sources = { busyness: sortedKeysBusyness, prices: sortedKeysPrices, crimeData: sortedKeysCrime, transportData: sortedKeysTransport };
      
          // Loop over each data source
          for (let source in sources) {
            // If the checkbox for this source is checked
            if (activeMaps[source]) {
              // Loop over the sorted keys for this source
              // while the rank is less than the amount of objects in the source, add the rank to the objectid
              for (let rank = 0; rank < sources[source].length; rank++) {
                let objectid = sources[source][rank];
                rankedData[source][objectid] = { score: eval(source)[objectid], rank: rank + 1 };
      
                // If the objectid already exists in current, add to its rank; otherwise, initialize it
                if (current[objectid]) {
                  current[objectid].rank += rank + 1;
                } else {
                  current[objectid] = { rank: rank + 1 };
                }
              }
            }
          }
      
          // Sort current data and assign ranks
          let sortedCurrent = Object.entries(current).sort((a, b) => a[1].rank - b[1].rank);
          for (let rank = 0; rank < sortedCurrent.length; rank++) {
            let [objectid] = sortedCurrent[rank];
            rankedData.current[objectid] = { rank: rank + 1 };
          }
        }
      }

      console.log("ranked data object: ", rankedData);
      console.log("active maps: ", activeMaps);
      setRankedData(rankedData);
    }
  
  }, [selectedTimeFrame, prices, crimeData, activeMaps, hour]);
 
 //takes in a rank and returns a color 
function getColorFromRank(rank) {
  if (rank === undefined) {
    return '#000000';
  }

  let lightness = ((rank - 1) / 32.5) * 35 + 25; 
  return `hsl(120, 100%, ${lightness}%)`;
}

//creates the geojson for the heatmap
//adds rank and color to each feature and score
const createHeatMapGeo = async (rankedData) => {
  // fetch('/filtered_geojson_file.geojson')
  // .then(response => response.json())
  // .then(data => {
  const response = await fetch('/filtered_geojson_file.geojson');
  let data = await response.json();
  
    if (mapIsCurrent) {
      console.log("This is our geojson: ", data);
      data.features.forEach(feature => {
        let objectid = feature.properties.objectid;

        if (rankedData.busyness.hasOwnProperty(objectid)) {
          let busynessRank = rankedData.busyness[objectid].rank;
          let busynessColor = getColorFromRank(busynessRank);
          feature.properties.busyness_color = busynessColor;
          feature.properties.busyness_rank = busynessRank;
          feature.properties.busyness_score = rankedData.busyness[objectid].score;
        } else {
          console.log(`objectid ${objectid} not found in rankedData.busyness.`);
        }
        if (rankedData.prices.hasOwnProperty(objectid)) {
          let pricesRank = rankedData.prices[objectid].rank;
          let pricesColor = getColorFromRank(pricesRank);
          feature.properties.prices_color = pricesColor;
          feature.properties.prices_rank = pricesRank;
          feature.properties.prices_score = rankedData.prices[objectid].score;

        } else {
          console.log(`objectid ${objectid} not found in rankedData.prices.`);
        }
        if (rankedData.transportData.hasOwnProperty(objectid)) {
          let transportRank = rankedData.transportData[objectid].rank;
          let transportColor = getColorFromRank(transportRank);
          feature.properties.transport_color = transportColor;
          feature.properties.transport_rank = transportRank;
        } else {
          console.log(`objectid ${objectid} not found in rankedData.transportData.`);
        }
        if (rankedData.crimeData.hasOwnProperty(objectid)) {
          let crimeRank = rankedData.crimeData[objectid].rank;
          let crimeColor = getColorFromRank(crimeRank);
          feature.properties.crime_color = crimeColor;
          feature.properties.crime_rank = crimeRank;
          feature.properties.crime_score = rankedData.crimeData[objectid].score;
        } else {
          console.log(`objectid ${objectid} not found in rankedData.crimeData.`);
        }

        //count of activeMaps
        if (activeMaps) {
        let activeCount = Object.values(activeMaps).filter(val => val).length;
        if (activeCount > 1) {
          if (rankedData.current.hasOwnProperty(objectid)) {
            let currentRank = rankedData.current[objectid].rank;
            let currentColor = getColorFromRank(currentRank);
            feature.properties.current_color = currentColor;
            feature.properties.current_rank = currentRank;
          } else {
            console.log(`objectid ${objectid} not found in rankedData.current.`);
          }
      }
    }
      })
        }
    setRankGeojsonData(data);
    console.log("This is our final geojson: ", data);

    return data;
  // });
}

// logic to handle heatmap creation
//takes in the geojson file and the color property
//colorProperty is a string that is a name of a property in the geojson (ex: busyness_color)
const createHeatMap = (geoJson, colorProperty) => {
  map.current.getSource("taxi_zones")?.setData(geoJson);
  
  map.current.addLayer({
    id: 'taxi_zones_fill_map',
    type: 'fill',
    source: 'taxi_zones',
    paint: {
      'fill-color': ['get', colorProperty],
      'fill-opacity': 0.5,
      'fill-outline-color': '#000000',
    }
  });
}

//creates the geojson for the heatmap
//called everytime the rankedData changes or the activeMaps changes (when a checkmark is clicked)
useEffect(() => {
  const generateGeoJson = async () => {
    if (mapIsCurrent && rankedData) {
      const newGeoJson = await createHeatMapGeo(rankedData);
      setNewGeoJson(newGeoJson);
    }
  };
  
  generateGeoJson();
}, [mapIsCurrent, rankedData, activeMaps]);

  //should be deleted and done in the backend 
  //cleans up busyness data and sets it to a state variable
  //called everytime the picklePredictions changes (when the predictions are updated)
  useEffect(() => {
    if (picklePredictions && yearData && weekData) {
      const predictions = Object.fromEntries(
        Object.entries(picklePredictions).map(([key, value]) => [key.replace("model_", ""), value])
      );
      const weekPredictions = Object.fromEntries(
        Object.entries(weekData).map(([key, value]) => [key.replace("model_", ""), value])
      );
      const yearPredictions = Object.fromEntries(
        Object.entries(yearData).map(([key, value]) => [key.replace("model_", ""), value])
      );

      console.log("Predictions is not empty:", predictions);
      console.log("Week Predictions", weekPredictions);
      console.log("year predictions", yearPredictions);
      setBusynessData(predictions);
      setWeekRankData(weekPredictions);
      setYearRankData(yearPredictions);
      // setYearData(yearPredictions);
      // setWeekData(weekPredictions);

      }
  }, [mapIsCurrent, picklePredictions, yearData, weekData]);  // Re-run effect whenever mapIsCurrent changes

//cleans up market data and sets it to a state variable
//triggered upon when the map is loaded in
  useEffect(() => {
  // Load the market data
  fetch('/market.json')
    .then(response => response.json())
    .then(marketData => {
      // Now we have the market data
      console.log("Original Market data: ", marketData);

      // Format the data as a key-value pair object
      let formattedData = marketData.reduce((accumulator, current) => {
        accumulator[current.TLC] = current.normalized_price;
        return accumulator;
      }, {});

      console.log("Formatted Market data: ", formattedData);

      if (mapIsCurrent) {
        console.log("if map.current");

        // Load GeoJSON data
        fetch('/filtered_geojson_file.geojson')
          .then(response => response.json())
          .then(data => {
            // Now we have the GeoJSON data
            // console.log("GeoJSON data: ", data);

            data.features.forEach(feature => {
              let objectid = feature.properties.objectid;
              let objectstring = objectid.toString();
              let normalizedPrice = formattedData[objectstring];

              // if (normalizedPrice) {
              //   // console.log("PRICE: ", normalizedPrice)
              //   feature.properties.color = getColorFromScore(normalizedPrice);
              //   feature.properties.price = normalizedPrice;
              // }

            });
            setPrices(formattedData);
            // setPriceGeoJsonData(data);
          });
      }
    });
}, [mapIsCurrent]);  // Re-run effect whenever mapIsCurrent changes

  //clean crime data and set it to state
  useEffect(() => {
    fetch('/crime_count.json')
      .then(response => response.json())
      .then(crimeData => {
        // Now we have the crime data
        console.log("Original Crime data: ", crimeData);
       
       // for each object in crimeData create a new json object thats ObjectID: Count
        let formattedCrimeData = crimeData.reduce((accumulator, current) => {
          accumulator[current.OBJECTID] = current.Count;
          return accumulator;
        }
        , {});
        console.log("Formatted Crime data: ", formattedCrimeData);
        setCrimeData(formattedCrimeData);
      });
  }, [mapIsCurrent]);  // Re-run effect whenever mapIsCurrent changes


//clean up the total_stations.json and set it to state
  useEffect(() => {
    fetch('/total_stations.json')
      .then(response => response.json())
      .then(totalStations => {
        console.log("Original Total Stations data: ", totalStations);

        //for each object in totalStations create a new json object that is ObjectID: Count
        let formattedTotalStations = totalStations.reduce((accumulator, current) => {
          accumulator[current.OBJECTID] = current.Total_Count;
          return accumulator;
        }
        , {});
        console.log("Formatted Total Stations data: ", formattedTotalStations);
        setTransportData(formattedTotalStations);
      }
      );
  }
  , [mapIsCurrent]);  // Re-run effect whenever mapIsCurrent changes

// console.log(myColorFunction(4));

  const [isLoading, setIsLoading] = useState(true);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-73.991462);
  const [lat, setLat] = useState(40.74629855245445);
  const [zoom, setZoom] = useState(12);
  const [pitch, setPitch] = useState(60);
  const [zonename, setName] = useState('');
  const [zonebusyness, setBusyness] = useState('');

  // const easingFunctions = {
  //   easeInCubic: function (t) {
  //     return t * t;
  //    }
  // };

  // wewrite the above function as one function

  const easeInCubic = (t) => {
    return t * t * t;
  }
  // TAKEAWAY RADIUS
  // for our takeaway radius
  const [takeoutLng, setTakeoutLng] = useState(null);
  const [takeoutLat, setTakeoutLat] = useState(null);
  const [profile, setProfile] = useState(null) 
  const [minutes, setMinutes] = useState(null) 
  const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';

  // Create a function that sets up the Isochrone API query then makes an fetch call
  // to the API and returns the data
  //this is what we call when we want to get the takeaway radius and add the layer
  // Create a function that sets up the Isochrone API query then makes an fetch call
  async function getIso() {
    const query = await fetch(
    `${urlBase}${profile}/${takeoutLng},${takeoutLat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
    );
    const data = await query.json();
    console.log("take out data: ", data);
    map.current.getSource('iso').setData(data);
  }


// add the source and layer to the map for takeaway radius
  useEffect(() => {
    if (map.current) {
    map.current.on('load', () => {
      // When the map loads, add the source and layer
      map.current.addSource('iso', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      map.current.addLayer(
        {
          id: 'isoLayer',
          type: 'fill',
          // Use "iso" as the data source for this layer
          source: 'iso',
          layout: {},
          paint: {
            // The fill color for the layer is set to a light purple
            'fill-color': '#5a3fc0',
            'fill-opacity': 0.3
          }
        },
        'poi-label'
      );
      });    
    }    
   }, [map.current]); 

   useEffect(() => {
    if (profile && minutes && takeoutLng && takeoutLat) {
      getIso();
    }
  }, [profile, minutes, takeoutLng, takeoutLat]);


  // Set bounds for Manhattan, New York.
  const bounds = [
    [-74.255591, 40.477399], // Southwest coordinates
    [-73.698697, 40.983697] // Northeast coordinates
  ];
      // const [currentGeoJSONIndex, setCurrentGeoJSONIndex] = useState(0);
  const [currentGeoJSONIndex, setCurrentGeoJSONIndex] = useState(selectedIndex);

  //sets the IsLoading state to false when the cafe data is loaded
  //updates every time the cafe data changes (should not change after initial load)
  useEffect(() => {
    console.log('Test to see if my data is correct:', data);
    if (data.length > 0) {
      setIsLoading(false);
    }
  }, [data]);


  //this code actually creates our map and sets the bounds
  //This should probably be moved to a different file or to the top of this file
  useEffect(() => {
    if (!isLoading && data.length > 0) {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/max1738/clkjsvxxp00ed01pg1pdq577i/draft',
      center: [lng, lat],
      zoom: 11.5,
      // minZoom: zoom,
      maxBounds: bounds,
      pitch: 0,
      bearing: 0,//300,
      
    });

    // setmapIsCurrent(true);
    // console.log("set map is current == TRUE");

    map.current.on('style.load', () => {


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

        map.current.loadImage('/bike.png', (error, image) => {
          if (error) throw error;
          map.current.addImage('custom-marker-5', image);

  

        map.current.addSource('bench_locations', {
          type: 'geojson',
          data: '/City_Bench_Locations.geojson',
                  
        });
          
      map.current.addSource('taxi_zones', {
        type: 'geojson',
        data: '/filtered_geojson_file.geojson'      
      });


      map.current.addSource('bike_locations', {
        type: 'geojson',
        data: '/bike_locations.geojson',
                
      });

// useState to check if map is current and if taxi zones have been loaded (must be after addSource(taxi_zones))
// used in heatmap function
      setmapIsCurrent(true);



      map.current.flyTo({
        center: [lng, lat], // offset the center
        zoom: 12.063698237457222,
        minZoom: zoom,
        pitch: 57.418875067604525,
        bearing: 0,
        curve: 0.19, // Default value
        speed: 0.1, // Make the flying slow
        duration: 8000,
        easing: easeInCubic,
        essential: true,
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

////////////
///////////
////////////
///THIS IS FOR THE MAP WITH THE BUSYNESS DATA
      // Add mouseenter event listener to change zone opacity on hover
      map.current.on('mousemove', 'taxi_zones_fill_map', (e) => {
        const hoveredZone = e.features[0].properties.objectid; // Get the ID of the hovered zone
        const zoneName = e.features[0].properties.zone;
        const zoneBusyness = e.features[0].properties.crime_rank;
        // Change fill opacity only for the hovered zone
        map.current.setPaintProperty('taxi_zones_fill_map', 'fill-opacity', [
          'match',
          ['get', 'objectid'],
          hoveredZone,
          0.8, // Increase opacity for the hovered zone
          0.5  // Default opacity for other zones
        ]);

        // Update the name state with the zone name and zoneBusyness
        setName(zoneName);
        setBusyness(zoneBusyness);
      });

      // Add mouseleave event listener to reset zone opacity when not hovering
      map.current.on('mouseleave', 'taxi_zones_fill_map', () => {
        map.current.setPaintProperty('taxi_zones_fill_map', 'fill-opacity', 0.5); // Reset fill opacity for last zone
        setName(''); // Clear the name state
        setBusyness(''); // Clear the busyness state
      });

      map.current.on('click', 'taxi_zones_fill_map', (e) => {
        const lngLat = {
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        };
        map.current.flyTo({ center: lngLat, zoom: 14 }); // Zoom in to the clicked point
      });    


    // cafe marker click function

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
  }, [isLoading, data, lng, lat, bounds]); //This is the useEffect dependency array
  //When any of the variables or states listed in the dependency array above change, the effect will run again.
  

//Pass in active buttons from FilterNav to affect the layers

// this function handles the logic for the layer change behind markers
// it takes in the active buttons from the FilterNav component
// and then adds/removes layers based on the active buttons
  const handleLayerChange = (activeButtons) => {
    setCurrentGeoJSONIndex(activeButtons);
  // Remove existing layers
  map.current.getStyle().layers.forEach((layer) => {
    if (
      layer.id === 'bench_locations_markers' ||
      layer.id === 'subway_markers' ||
      layer.id === 'bus_markers' ||
      layer.id === 'cafe_markers' ||
      layer.id === 'taxi_zones_fill' ||
      layer.id === 'taxi_zones_fill_map' ||
      layer.id === 'taxi_zones_price_map' ||
      layer.id === 'bike_locations'
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

    if (activeButtons.includes(5)) {
      map.current.addLayer({
        id: 'bike_locations',
        type: 'symbol',
        source: 'bike_locations',
        layout: {
          'icon-image': 'custom-marker-5',
          'icon-size': 0.5,
        }
      });
    }

  };



// this function adds the heatmap to the map
// calls the createHeatMap fuction and passes in newGeoJson and the colorProperty (current_color)
//this function is only called when a checkbox is checked
  const handleHeatMap = (activeMaps) => {

    // save the state of activeMaps on function call
    setActiveMaps(activeMaps);
    
    //if the current layer is taxi zones, remove it
    if (map.current.getLayer("taxi_zones_fill_map")) {
    map.current.removeLayer("taxi_zones_fill_map");
    }

    if (activeMaps) {
      //if more than one thing in active maps is true
  const activeCount = Object.values(activeMaps).filter(val => val).length;
      
  if (activeCount > 1 && newGeoJson) {
// add heatmap 
    if (mapIsCurrent && newGeoJson) {
      console.log("Adding combined Heatmap")
      createHeatMap(newGeoJson, "current_color");
    }
  }
  else {
    if (activeMaps.busyness) {
      console.log('Busyness is checked');
      // add heatmap 
        if (mapIsCurrent && newGeoJson) {
          createHeatMap(newGeoJson, "busyness_color");
        }
  } else {
      console.log('Busyness is unchecked');
  }

  if (activeMaps.crimeData) {
      console.log('Crime Rate is checked');
      // add heatmap 
      if (mapIsCurrent && rankedGeoJson) {
        createHeatMap(newGeoJson, "crime_color");
      }
} else {
      console.log('Crime Rate is unchecked');
  }

  if (activeMaps.prices) {
      console.log('Property Prices is checked');
      // add heatmap 
      if (mapIsCurrent && rankedGeoJson) {
        createHeatMap(newGeoJson, "prices_color");
      }
} else {
      console.log('Property Prices is unchecked');
  }
  if (activeMaps.transportData) {
    console.log('Transport is checked');
    // add heatmap 
    if (mapIsCurrent && rankedGeoJson) {
      createHeatMap(newGeoJson, "transport_color");
    }
} else {
    console.log('Transport is unchecked');
}
}
    }
  };


//this function calls handleHeatMap when newGeoJson is updated
//aka when a checkbox is checked
useEffect(() => {
  if (newGeoJson) {
    handleHeatMap(activeMaps);
  }
}, [newGeoJson]);
  
  const lnglat =  {lng: -73.9712, lat:40.7831};
  const handleReset = () => {
    map.current.flyTo({ center: lnglat, zoom: 11.75 }); // 
  };

  return (
    <MapContext.Provider value={map.current}>
    <div>
      {/* Render the name element */}
      <Navbar name = {zonename} busyness = {zonebusyness} />
      <button onClick={handleReset}>Reset</button>
      <CafeDrawer cafeId={selectedCafeId} cafe_url = {selectedImage}  cafe_name = {selectedName} cafe_rating = {selectRating}/>
            {/* Map container */}
      <div ref={mapContainer} className="map-container"> {/*the useRef is being used to render the map */}
      {/* {isButton5Active && (<Legend/>)} Render the legend if the button is active */}
      </div>
      <HeatMapBox handleHeatMap = {handleHeatMap} />
      <TakeOutBox setProfile={setProfile} setMinutes={setMinutes} setTakeoutLat={setTakeoutLat} setTakeoutLng={setTakeoutLng}/>
      <BusynessSlider selectedTimeFrame = {selectedTimeFrame} setSelectedTimeFrame = {setSelectedTimeFrame} hour = {hour} setHour = {setHour} />
      <div className="filter-nav-container">
      <FilterNav handleLayerChange={handleLayerChange} />
    </div>
    </div>
    </MapContext.Provider>
  );
}

export default Map;
