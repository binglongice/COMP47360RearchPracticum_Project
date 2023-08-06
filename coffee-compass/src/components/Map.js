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
import LineChart from './LineChart';
import Drawer from './Drawer';
import HeatMapButton from './HeatMapButton';
import TakeOutButton from './TakeOutButton';
import HelpButton from './HelpButton';
import HelpBox from './HelpBox';
import ModeSelection from './ModeSelection';
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4MTczOCIsImEiOiJjbGoybXdvc3QxZGZxM2xzOTRpdGtqbmMzIn0.ZLAd2HM1pH6fm49LnVzK5g';

function Map({ selectedIndex, addNextStep }) {

  const getHour = () => {
    const today = new Date();
    return today.getHours();
  }



  // const [selectedCafeId, setSelectedCafeId] = useState(null);
  const {data, setData, reviews, setReviews, picklePredictions, setPicklePredictions, yearData, setYearData, weekData, setWeekData, sortedCafes, setSortedCafes, cafeDensity, prices, setSelectedCafeId, fetchReviews} = useContext(ApiContext);  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [mapIsCurrent, setmapIsCurrent] = useState(false);

  const [selectRating,  setSelectedRating] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null); //we need to store the geoJson data in state so that we can use it outside where its defined 
  const [predictionsData, setPredictions] = useState(null); //we need to store the predictions ... 
  const [isButton5Active, setIsButton5Active] = useState(true); //render the heatmap legend or not
  // const [prices, setPrices] = useState(null); //we need to store the prices ...
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
  const [chartFlag, setChartFlag] = useState(false);
  const [currentObjectId, setCurrentObjectId] = useState(null);
  const [rightSidebar, setRightSidebar] = useState(false);
  const [sideBarName, setSideBarName] = useState(null);
  const [zoneBusynessRank, setZoneBusynessRank ] = useState(null);
  const [zonePropertyRank, setZonePropertyRank ] = useState(null);
  const [zoneCrimeRank, setZoneCrimeRank ] = useState(null);
  const [zoneTransportRank, setZoneTransportRank ] = useState(null);
  const [zoneCombinedRank, setZoneCombinedRank ] = useState(null);
  const [heatMap, setHeatMap] = useState(1); // 1 to render on page load
  const [takeOut, setTakeOut] = useState(false); // true to render on page load
  const [isMouseOverPopup, setIsMouseOverPopup] = useState(false);
  const [helpBox, setHelpBox] = useState(false);
  const [mouseOverPopup, setPopup] = useState(null);
  const [activeIndex, setActiveIndex] = useState(getHour());
  const [cafeDensityRank, setCafeDensity] = useState(null);
  const [cafeClick, setCafeClick] = useState(false);
  const [busynessRank, setBusynessRank] = useState(null);
  const [crimeRank, setCrimeRank] = useState(null);
  const [crimeRankLow, setCrimeRankLow] = useState(null);
  const [propertyRank, setPropertyRank] = useState(null);
  const [transportRank, setTransportRank] = useState(null);
  const [combinedRank, setCombinedRank] = useState(null);
  const [cafeRank, setCafeRank] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);
  const [suggestionFlag, setSuggestionFlag] = useState(false); //allows us to find a suggestion
  const [findSuggestionButton, setFindSuggestionButton] = useState(false); //triggers the find suggestion button
  const [suggestedZoneInfo, setSuggestedZoneInfo] = useState(null); //stores the suggested zone info
  const [zoneFlag, setZoneFlag] = useState(false); //renders zone sidebar if true
  const [checked, setChecked] = useState({
    busyness: true,
    crimeData: false,
    prices: false,
    transportData: false,
    cafeDensity: false,
  });
  const [activeButtons, setActiveButtons] = useState([]);

//takes in the json objects for busyness prices and crime
//returns a json object with the objectid as the key and the rank as the value
//assigns rank to each feature and creates a combined rank and current rank
//the current rank is updated after each filter is applied via activeMaps
//combined rank is updated if busyness data is changed
  useEffect(() => {
    if (selectedTimeFrame && prices && crimeData && transportData && cafeDensity) {
      let rankedData = {
        "busyness": {},
        "prices": {},
        "crimeData": {},
        "crimeDataLow": {},
        "transportData": {},
        "cafeDensity": {},
        "combined": {},
        "current": {},
      };
      console.log("This is the selected time frame: ", selectedTimeFrame);
      //depending on the value of busyness Data we will switch the data that we use to rank busyness
      let busynessData;
      switch(selectedTimeFrame) {
        case 'day':
          busynessData = picklePredictions;
          break;
        case 'week':
          busynessData = weekData;
          break;
        case 'year':
          busynessData = yearData;
          break;
        default:
          busynessData = picklePredictions;
      }
      console.log("This is busynessData as it switches!: ", busynessData);
      console.log("This is prices: ", prices);
  
      let sortedKeysBusyness = Object.keys(busynessData).sort((a, b) => busynessData[b][activeIndex] - busynessData[a][activeIndex]);
      let sortedKeysPrices = Object.keys(prices).sort((a, b) => prices[b] - prices[a]);
      let sortedKeysCrime = Object.keys(crimeData).sort((a, b) => crimeData[a] - crimeData[b]); //sort so that zone with highest crime is first
      let sortedKeysCrimeLow = Object.keys(crimeData).sort((a, b) => crimeData[a] - crimeData[b]); //sort so that zone with lowest crime is first
      let sortedKeysTransport = Object.keys(transportData).sort((a, b) => transportData[b] - transportData[a]); 
      let sortedKeysCafes = Object.keys(cafeDensity).sort((a, b) => cafeDensity[b] - cafeDensity[a]);
      let combined = {};
      let current = {};
      
      setBusynessRank(sortedKeysBusyness);
      setPropertyRank(sortedKeysPrices);
      setCrimeRank(sortedKeysCrime);
      setCrimeRankLow(sortedKeysCrimeLow)
      setTransportRank(sortedKeysTransport);
      setCafeRank(sortedKeysCafes);

      console.log("sortedKeysBusyness", sortedKeysBusyness);
      console.log("sortedKeysPrices", sortedKeysPrices);
  
      //rank is our index in the sorted array (to go through the entire array we need to add 1 to the index)
      //
      for (let rank = 0; rank < sortedKeysBusyness.length; rank++) {
        let objectid = sortedKeysBusyness[rank];
        rankedData.busyness[objectid] = { score: busynessData[objectid], rank: rank + 1 };
  
        // Initialize combined rank with busyness rank
        combined[objectid] = { rank: rank + 1 };
      }
  
      for (let rank = 0; rank < sortedKeysPrices.length; rank++) {
        let objectid = sortedKeysPrices[rank];
        rankedData.prices[objectid] = { score: prices[objectid], rank: rank + 1 };
  
          // Check if combined[objectid] exists before trying to add to its rank
          if (!combined[objectid]) {
            combined[objectid] = { rank: rank + 1 };
          } else {
            combined[objectid].rank += rank + 1;
          }
        }  

      for (let rank = 0; rank < sortedKeysCrime.length; rank++) {
        let objectid = sortedKeysCrime[rank];
        rankedData.crimeData[objectid] = { score: crimeData[objectid], rank: rank + 1 };
  
        // Add crimeData rank to combined rank

          // Check if combined[objectid] exists before trying to add to its rank
          if (!combined[objectid]) {
            combined[objectid] = { rank: rank + 1 };
          } else {
            combined[objectid].rank += rank + 1;
          }
        }  

        for (let rank = 0; rank < sortedKeysCrimeLow.length; rank++) {
          let objectid = sortedKeysCrimeLow[rank];
          rankedData.crimeDataLow[objectid] = { score: crimeData[objectid], rank: rank + 1 };
    
          // Add crimeDataLow rank to combined rank
  
            // Check if combined[objectid] exists before trying to add to its rank
            if (!combined[objectid]) {
              combined[objectid] = { rank: rank + 1 };
            } else {
              combined[objectid].rank += rank + 1;
            }
          }  
  

      for (let rank = 0; rank < sortedKeysTransport.length; rank++) {
        let objectid = sortedKeysTransport[rank];
        rankedData.transportData[objectid] = { score: transportData[objectid], rank: rank + 1 };
  
        // Add transport rank to combined rank
        combined[objectid].rank += rank + 1;
      }

      for (let rank = 0; rank < sortedKeysCafes.length; rank++) {
        let objectid = sortedKeysCafes[rank];
        rankedData.cafeDensity[objectid] = { score: cafeDensity[objectid], rank: rank + 1 };
  
        // Add cafe rank to combined rank
          // Check if combined[objectid] exists before trying to add to its rank
          if (!combined[objectid]) {
            combined[objectid] = { rank: rank + 1 };
          } else {
            combined[objectid].rank += rank + 1;
          }
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
          const sources = { busyness: sortedKeysBusyness, prices: sortedKeysPrices, crimeData: sortedKeysCrime, transportData: sortedKeysTransport, cafeDensity: sortedKeysCafes };
      
          // Loop over each data source
          for (let source in sources) {
            // If the checkbox for this source is checked
            if (activeMaps[source]) {
              // Loop over the sorted keys for this source
              // while the rank is less than the amount of objects in the source, add the rank to the objectid
              for (let rank = 0; rank < sources[source].length; rank++) {
                let objectid = sources[source][rank];
                rankedData[source][objectid] = { score: sources[source][objectid], rank: rank + 1 };
      
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
          setCurrentRank(sortedCurrent);
        }
        if (activeCount === 1) {
          // find which map is active
          let activeSource = Object.keys(activeMaps).find(source => activeMaps[source]);
          
          // Initialize current
          rankedData.current = {};
          let current = {};
          const sources = { busyness: sortedKeysBusyness, prices: sortedKeysPrices, crimeData: sortedKeysCrime, transportData: sortedKeysTransport, cafeDensity: sortedKeysCafes };

        
          // If the activeSource exists in sources, set the currentRank
          if (sources[activeSource]) {
            // Loop over the sorted keys for this source
            for (let rank = 0; rank < sources[activeSource].length; rank++) {
              let objectid = sources[activeSource][rank];
              rankedData[activeSource][objectid] = { score: sources[activeSource][objectid], rank: rank + 1 };
        
              // If the objectid already exists in current, add to its rank; otherwise, initialize it
              if (current[objectid]) {
                current[objectid].rank += rank + 1;
              } else {
                current[objectid] = { rank: rank + 1 };
              }
            }
        
            // Sort current data and assign ranks
            let sortedCurrent = Object.entries(current).sort((a, b) => a[1].rank - b[1].rank);
            for (let rank = 0; rank < sortedCurrent.length; rank++) {
              let [objectid] = sortedCurrent[rank];
              rankedData.current[objectid] = { rank: rank + 1 };
            }
            setCurrentRank(sortedCurrent);
          }
        }                


      
      }

      console.log("ranked data object: ", rankedData);
      console.log("active maps: ", activeMaps);
      setRankedData(rankedData);
      setCombinedRank(combined);
      setSuggestionFlag(true);

    }

  
  }, [selectedTimeFrame, prices, crimeData, activeMaps, activeIndex]);
 
 //takes in a rank and returns a color 
function getColorFromRank(rank) {
  if (rank === undefined) {
    return '#000000';
  }

  let lightness = ((rank - 1) / 32.5) * 35 + 25; 
  return `hsl(120, 100%, ${lightness}%)`;
}

useEffect(() => {
  console.log("PREDICTION DATA: ", picklePredictions);
}, [picklePredictions]);

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
          if (rankedData.current.hasOwnProperty(objectid)) {
            let currentRank = rankedData.current[objectid].rank;
            feature.properties.current_rank = currentRank;
          } else {
            console.log(`objectid ${objectid} not found in rankedData.current.`);
          }        } else {
          console.log(`objectid ${objectid} not found in rankedData.busyness.`);
        }
        if (rankedData.prices.hasOwnProperty(objectid)) {
          let pricesRank = rankedData.prices[objectid].rank;
          let pricesColor = getColorFromRank(pricesRank);
          feature.properties.prices_color = pricesColor;
          feature.properties.prices_rank = pricesRank;
          feature.properties.prices_score = rankedData.prices[objectid].score;
          if (rankedData.current.hasOwnProperty(objectid)) {
            let currentRank = rankedData.current[objectid].rank;
            feature.properties.current_rank = currentRank;
          } else {
            console.log(`objectid ${objectid} not found in rankedData.current.`);
          }

        } else {
          console.log(`objectid ${objectid} not found in rankedData.prices.`);
        }
        if (rankedData.transportData.hasOwnProperty(objectid)) {
          let transportRank = rankedData.transportData[objectid].rank;
          let transportColor = getColorFromRank(transportRank);
          feature.properties.transport_color = transportColor;
          feature.properties.transport_rank = transportRank;
          if (rankedData.current.hasOwnProperty(objectid)) {
            let currentRank = rankedData.current[objectid].rank;
            feature.properties.current_rank = currentRank;
          } else {
            console.log(`objectid ${objectid} not found in rankedData.current.`);
          }
        } else {
          console.log(`objectid ${objectid} not found in rankedData.transportData.`);
        }
        if (rankedData.crimeData.hasOwnProperty(objectid)) {
          let crimeRank = rankedData.crimeData[objectid].rank;
          let crimeColor = getColorFromRank(crimeRank);
          feature.properties.crime_color = crimeColor;
          feature.properties.crime_rank = crimeRank;
          feature.properties.crime_score = rankedData.crimeData[objectid].score;
          if (rankedData.current.hasOwnProperty(objectid)) {
            let currentRank = rankedData.current[objectid].rank;
            feature.properties.current_rank = currentRank;
          } else {
            console.log(`objectid ${objectid} not found in rankedData.current.`);
          }
        } else {
          console.log(`objectid ${objectid} not found in rankedData.crimeData.`);
        }

        if (rankedData.crimeDataLow.hasOwnProperty(objectid)) {
          let crimeRanLow = rankedData.crimeData[objectid].rank;
          feature.properties.crime_rank_low = crimeRank;
          if (rankedData.current.hasOwnProperty(objectid)) {
            let currentRank = rankedData.current[objectid].rank;
            feature.properties.current_rank = currentRank;
          } else {
            console.log(`objectid ${objectid} not found in rankedData.current.`);
          }
        } else {
          console.log(`objectid ${objectid} not found in rankedData.crimeDataLow.`);
        }

        if (rankedData.cafeDensity.hasOwnProperty(objectid)) {
          let cafeRank = rankedData.cafeDensity[objectid].rank;
          let cafeColor = getColorFromRank(cafeRank);
          feature.properties.cafe_color = cafeColor;
          feature.properties.cafe_rank = cafeRank;
          if (rankedData.current.hasOwnProperty(objectid)) {
            let currentRank = rankedData.current[objectid].rank;
            feature.properties.current_rank = currentRank;
          } else {
            console.log(`objectid ${objectid} not found in rankedData.current.`);
          }
        }
        else {
          console.log(`objectid ${objectid} not found in rankedData.cafeDensity.`);
        }

        if (rankedData.combined.hasOwnProperty(objectid)) {
          let combinedRank = rankedData.combined[objectid].rank;
          feature.properties.combined_rank = combinedRank;
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
    if (!map.current.getSource('iso')) {
      map.current.addSource('iso', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
    }
    if (!map.current.getLayer('isoLayer')) {
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
    }

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
    console.log('Test to see if my cafe data is correct:', data);
    if (sortedCafes.length > 0) {
      setIsLoading(false);
    }
  }, [sortedCafes]);




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
    // console.log("map.current: ", map.current);

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
        // zoom: 12.063698237457222,
        zoom: 12.2,
        minZoom: zoom,
        // pitch: 57.418875067604525,
        pitch: 45,
        bearing: 0,
        curve: 0.19, // Default value
        speed: 0.1, // Make the flying slow
        duration: 4000,
        // easing: easeInCubic,
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
    // data variable is all our cafes
    map.current.addSource('cafes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sortedCafes.map((cafe) => ({
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
        setBusyness(hoveredZone);
      });

      // Add mouseleave event listener to reset zone opacity when not hovering
      map.current.on('mouseleave', 'taxi_zones_fill_map', () => {
        map.current.setPaintProperty('taxi_zones_fill_map', 'fill-opacity', 0.5); // Reset fill opacity for last zone
        setName(''); // Clear the name state
        setBusyness(''); // Clear the busyness state
      });

      map.current.on('click', 'taxi_zones_fill_map', (e) => {
        const objectid = e.features[0].properties.objectid;
        const zoneName = e.features[0].properties.zone;
        const zoneBusynessRank = e.features[0].properties.busyness_rank;
        const zoneCrimeRank = e.features[0].properties.crime_rank;
        const zonePropertyRank  = e.features[0].properties.prices_rank;
        const zoneCombinedRank = e.features[0].properties.combined_rank;
        const zoneTransportRank = e.features[0].properties.transport_rank;
        const cafeDensityRank = e.features[0].properties.cafe_rank;
        setChartFlag(true);
        setCurrentObjectId(objectid);
        setCafeClick(false);
        setSideBarName(zoneName);
        setZoneBusynessRank(zoneBusynessRank);
        setZoneCrimeRank(zoneCrimeRank);
        setZonePropertyRank(zonePropertyRank);
        setZoneCombinedRank(zoneCombinedRank);
        setZoneTransportRank(zoneTransportRank);
        setCafeDensity(cafeDensityRank);
        setZoneFlag(true);
        setRightSidebar(true);

        // const lngLat = {
        //   lng: e.lngLat.lng,
        //   lat: e.lngLat.lat
        // };
        // setTimeout(() => {
        //   map.current.flyTo({ center: lngLat, zoom: 14 });
        // }, 1000); // Delay in milliseconds
    });
      let currentZone = null; // Holds the current zone

      map.current.on('mousemove', 'taxi_zones_fill_map', (e) => {
        const zoneName = e.features[0].properties.zone;

        // If the mouse has moved to a new zone
        if (zoneName !== currentZone) {
          // Update the current zone
          currentZone = zoneName;
          setName(zoneName);
  

          // If a popup already exists, remove it
          if (popup) {
            popup.remove();
          }

          // Create a new popup with the current zoneName
        var offset = {
            'right': [500],
        };

        popup.setLngLat(e.lngLat, { offset: offset['right'] });          
        popup.setHTML(`

          <div class="my-custom-popup">
          
          <strong class = "large-text">${zoneName}</strong> <br>
          <strong class = "small-text">Busyness Rank:</strong> ${e.features[0].properties.busyness_rank} <br>
          <strong class = "small-text">Suitability Rank:</strong> ${e.features[0].properties.combined_rank} <br>
          </div>
          `);
          
          popup.addTo(map.current);
        }
      });
      
      
      
      map.current.on('mouseleave', 'taxi_zones_fill_map', () => {
        if (popup ) {
          popup.remove();
        }
        currentZone = null; // Reset the current zone when the mouse leaves the layer
      });
      
      
      // const lngLat = {
        //   lng: e.lngLat.lng,
        //   lat: e.lngLat.lat
        // };
        // map.current.flyTo({ center: lngLat, zoom: 14 }); // Zoom in to the clicked point
      // });    


    // cafe marker click function
    map.current.on('click', 'cafe_markers', (e) => {
      const cafe_id = e.features[0].properties.id;
      const cafe_url = e.features[0].properties.image_url;
      const cafe_name = e.features[0].properties.name;
      const cafe_rating = e.features[0].properties.rating
      const objectid = e.features[0].properties.objectid;
      // console.log(cafe_id);
      setSelectedCafeId(cafe_id);
      setSelectedImage(cafe_url)
      setSelectedName(cafe_name)
      setSelectedRating(cafe_rating)
      // onCafeSelection(cafe_id);
      // setChartFlag(true);
      setCurrentObjectId(objectid);
      fetchReviews(cafe_id);
      setRightSidebar(true);
      setZoneFlag(false);
      setCafeClick(true); //passed into drawer component to open drawer with detailed cafe info




    });

  
  };
  }, [isLoading, data, lng, lat, bounds]); //This is the useEffect dependency array
  //When any of the variables or states listed in the dependency array above change, the effect will run again.
  useEffect(() => {
    console.log("POPUP", mouseOverPopup)
  }, [mouseOverPopup])


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

  setChecked({
    busyness: false,
    crimeData: false,
    prices: false,
    transportData: false,
    cafeDensity: false,
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

    setActiveButtons([]);
    
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
  if (activeMaps.cafeDensity) {
    console.log('Cafe Density is checked');
    // add heatmap 
    if (mapIsCurrent && rankedGeoJson) {
      createHeatMap(newGeoJson, "cafe_color");
    }
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

useEffect(() => {
  console.log("This is our chart flag ", chartFlag);
  console.log("This is our chart object id", currentObjectId);
}, [chartFlag, currentObjectId]);


  const lnglat =  {lng: -73.9712, lat:40.7831};
  const handleReset = () => {
    map.current.flyTo({ center: lnglat, zoom: 11.75 }); // 
  };
  
  //this returns map.current and allows us to use it in other components
  //this is used in the Drawer component
  //this helps with avoiding common pitfalls of useState asynchronous behavior
  const getMap = () => map.current;


      //function that returns the top rated zone based on the selected heatmap (checked)
    //this is used to suggest a zone to the user
    //it returns the zone with the highest current rank
    const suggestZone = (activeMaps) => {
      //if a single checkbox is checked, return the zone with the highest rank for that heatmap
      if (activeMaps.busyness && !activeMaps.cafeDensity && !activeMaps.crimeData && !activeMaps.prices && !activeMaps.transportData) {
        console.log("fuck busyness", busynessRank);
        let foundZone = [busynessRank[0], busynessRank[1], busynessRank[2]]
        return foundZone;
      }
      else if (!activeMaps.busyness && activeMaps.cafeDensity && !activeMaps.crimeData && !activeMaps.prices && !activeMaps.transportData) {
        let foundZone = [cafeRank[0], cafeRank[1], cafeRank[2]]
        return foundZone;
      }
      //crime rank will reccomend zones with low ranks 
      else if (!activeMaps.busyness && !activeMaps.cafeDensity && activeMaps.crimeData && !activeMaps.prices && !activeMaps.transportData) {
        let foundZone = [crimeRankLow[0], crimeRankLow[1], crimeRankLow[2]];        
        return foundZone;
      }
      else if (!activeMaps.busyness && !activeMaps.cafeDensity && !activeMaps.crimeData && activeMaps.prices && !activeMaps.transportData) {
        let foundZone = [propertyRank[0], propertyRank[1], propertyRank[2]]
        return foundZone;
      }
      else if (!activeMaps.busyness && !activeMaps.cafeDensity && !activeMaps.crimeData && !activeMaps.prices && activeMaps.transportData) {
        let foundZone = [transportRank[0], transportRank[1], transportRank[2]]
        return foundZone;
      }
      else {
        //if more than one checkbox is checked, return the zone with the highest rank for the combined heatmap
        let foundZone = [currentRank[0][0], currentRank[1][0], currentRank[2][0]]
        return foundZone;
      }
    }
    useEffect(() => {
      //if the 
    if (findSuggestionButton === true && activeMaps && suggestionFlag === true) {
    // console.log("TESTING findsuggestion return button", suggestZone(activeMaps));

    let objectIDs = suggestZone(activeMaps);
    console.log("These are our objectIDs", objectIDs);
    let zoneInfo = objectIDs.map(id => rankedGeoJson.features.find(feature => feature.properties.objectid === id));    console.log("Zone Info", zoneInfo);
    setSuggestedZoneInfo(zoneInfo);
    setSuggestionFlag(false);
    setFindSuggestionButton(false);
    setCafeClick(false);
    setZoneFlag(false);
    setRightSidebar(false); 
    setSuggestionFlag(true);
    setRightSidebar(true); 

    }
  }, [suggestionFlag, activeMaps, findSuggestionButton]);


  // function to remove all markers from the map if the user displays a heatmap 
    useEffect(() => {
      if (activeMaps) {
      if(activeMaps.busyness || activeMaps.cafeDensity || activeMaps.crimeData || activeMaps.prices || activeMaps.transportData) {
      map.current.getStyle().layers.forEach((layer) => {
        if (
          layer.id === 'bench_locations_markers' ||
          layer.id === 'subway_markers' ||
          layer.id === 'bus_markers' ||
          layer.id === 'cafe_markers' ||
          layer.id === 'taxi_zones_fill' ||
          layer.id === 'taxi_zones_price_map' ||
          layer.id === 'bike_locations'
        ) {
          map.current.removeLayer(layer.id);
        }
      })
    }
  }
      },[activeMaps]);
      



//if checked is false, remove the heatmap
// useEffect(() => {
//     let allFalse = true;
//   for (let key in checked) {
//     if (checked[key]) {
//       allFalse = false;
//       break;
//     }
//   }
//   if (map.current && allFalse) {
//     map.current.getStyle().layers.forEach((layer) => {
//       if (
//         layer.id === 'bench_locations_markers' ||
//         layer.id === 'subway_markers' ||
//         layer.id === 'bus_markers' ||
//         layer.id === 'cafe_markers' ||
//         layer.id === 'taxi_zones_fill' ||
//         layer.id === 'taxi_zones_fill_map' ||
//         layer.id === 'taxi_zones_price_map' ||
//         layer.id === 'bike_locations'
//       ) {
//         map.current.removeLayer(layer.id);
//       }
//     })
//   }  
//   }, [checked]);
  
  return (
    <MapContext.Provider value={map.current}>
    <div>
    <HelpButton helpBox = {helpBox} setHelpBox = {setHelpBox} />

    <header>
      <div id="compass-btn"><img src="./compass-coffee.png" width="50px" height="50px"/></div>
      <div id="title">Culinary Compass</div>
      <div id="page-toggle"><img src="./page-nav.png"  width="40px" height="40px"/></div>
    </header>


      {/* Render the name element */}
      {/* <Navbar name = {zonename} busyness = {zonebusyness} /> */}

      {/* <CafeDrawer cafeId={selectedCafeId} cafe_url = {selectedImage}  cafe_name = {selectedName} cafe_rating = {selectRating}/> */}
            {/* Map container */}
      {mapIsCurrent && rightSidebar === true &&  <Drawer getMap = {getMap} rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} dayData = {picklePredictions} weekData = {weekData} yearData = {yearData} objectID = {currentObjectId} name = {sideBarName} busynessRank = {zoneBusynessRank} crimeRank = {zoneCrimeRank} propertyRank = {zonePropertyRank} transitRank = {zoneTransportRank} combinedRank = {zoneCombinedRank} cafeRank = {cafeDensityRank} cafe_url = {selectedImage}  cafe_name = {selectedName} cafe_rating = {selectRating} cafeClick = {cafeClick} setCafeClick = {setCafeClick} zoneInfo = {suggestedZoneInfo} zoneFlag = {zoneFlag} setZoneFlag ={setZoneFlag} suggestionFlag = {suggestionFlag} setSelectedImage = {setSelectedImage} setSelectedName = {setSelectedName} setSelectedRating = {setSelectedRating} newGeoJson = {newGeoJson}   setChartFlag={setChartFlag}
  setCurrentObjectId={setCurrentObjectId}
  setSideBarName={setSideBarName}
  setZoneBusynessRank={setZoneBusynessRank}
  setZoneCrimeRank={setZoneCrimeRank}
  setZonePropertyRank={setZonePropertyRank}
  setZoneCombinedRank={setZoneCombinedRank}
  setZoneTransportRank={setZoneTransportRank}
  setCafeDensity={setCafeDensity}
   />}

      <div ref={mapContainer} className="map-container"/> {/*the useRef is being used to render the map */}
      {/* {isButton5Active && (<Legend/>)} Render the legend if the button is active */}

       <div className = "heatmap-analytics">
       {/* <ModeSelection /> */}

       <BusynessSlider selectedTimeFrame = {selectedTimeFrame} setSelectedTimeFrame = {setSelectedTimeFrame} activeIndex = {activeIndex} setActiveIndex = {setActiveIndex} />

       {activeMaps && <Legend activeMaps = {activeMaps}/>}

       <HeatMapButton heatMap = {heatMap} setHeatMap = {setHeatMap} addNextStep={addNextStep} />

       {mapIsCurrent && <div style={{ visibility: heatMap === 1 ? "hidden" : "visible" }}> <HeatMapBox checked = {checked} setChecked = {setChecked} handleHeatMap = {handleHeatMap} setFindSuggestionButton = {setFindSuggestionButton} /> </div>} 

      </div>
      <TakeOutButton takeOut = {takeOut} setTakeOut = {setTakeOut}  />
      {takeOut && mapIsCurrent && <TakeOutBox setProfile={setProfile} setMinutes={setMinutes} setTakeoutLat={setTakeoutLat} setTakeoutLng={setTakeoutLng} getMap = {getMap} setChecked = {setChecked} /> }
      <div className="filter-nav-container">
      <FilterNav activeButtons = {activeButtons} setActiveButtons = {setActiveButtons} handleLayerChange={handleLayerChange} />

    </div>
    {helpBox && <HelpBox setHelpBox = {setHelpBox}/>}

    {/* {chartFlag === true && currentObjectId !== null &&  <LineChart dayData = {busyness} weekData = {weekRankData} yearData = {yearRankData} objectID = {currentObjectId}/>} */}
    </div>
    </MapContext.Provider>
  );
}

export default Map;
