import React, { useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import axios from 'axios';
import { point, polygon, booleanPointInPolygon } from '@turf/turf';



// Need to pass in current date
const getFormattedDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const month = today.getMonth() + 1; // 1 (January) to 12 (December)

  // Calculate the week_of_year based on the date
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

  return `${dayOfWeek}/${month}/${weekOfYear}`;
};

//return current week of year
const getWeek = () => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return weekOfYear;
}






function Store({ children, selectedCafeId }) {
  const [data, setData] = useState([]); //cafe data
  const [reviews, setReviews] = useState([]); //yelp reviews 
  const [picklePredictions, setPicklePredictions] = useState([]); //busyness predictions
  const location = 'Manhattan'; 
  const [yearData, setYearData] = useState([]); 
  const [weekData, setWeekData] = useState([]);
  const [sortedCafes, setSortedCafes] = useState([]);
  const [cafeDensity, setCafeDensity] = useState([]);
  const [taxiGeoJson, setTaxiGeoJson] = useState([]);
  const [objectIds] = [
    '4', '24', '12', '13', '41', '45', '42', '43', '48', '50', 
    '68', '79', '74', '75', '87', '88', '90', '125', '100', '107', 
    '113', '114', '116', '120', '127', '128', '151', '140', '137', 
    '141', '142', '152', '143', '144', '148', '153', '158', '161', 
    '162', '163', '164', '170', '166', '186', '194', '202', '209', 
    '211', '224', '229', '230', '231', '239', '232', '233', '234', 
    '236', '237', '238', '263', '243', '244', '246', '249', '261', 
    '262'];



  //API fetch request via axios
  //Used to interact with Django endpoint - using GET request
  //this returns our cafe data
  const fetchData = () => {
    console.log('Before calling getCafesByLocation');
    return axios
      .get(`http://127.0.0.1:8000/yelp_api/api/cafes/${location}/`)
      .then((response) => {
        const responseData = response.data;
        console.log('Received data:', responseData);
        setData(responseData); //Saves data as response data (from Django db) - returned API data
        return responseData;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const fetchReviews = (id) => {
    return axios
      .get(`http://127.0.0.1:8000/yelp_api/api/reviews/${id}/`)
      .then((response) => {
        const reviewData = response.data;
        console.log('Received reviews:', reviewData);
        setReviews(reviewData);
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  useEffect(() => {
    fetchData().catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    if (selectedCafeId) {
      fetchReviews(selectedCafeId).catch((error) => {
        console.log(error);
      });
    }
  }, [selectedCafeId]);

  //new useEffect for model predictions - CURRENTLY HARDCODED - seems to be logging twice
  //Day, Month, Week_of_Year 
  //0-6, 1-12, 0-52
  useEffect(() => {
    const todayDate = getFormattedDate();
    console.log('input to 24 hour API - day/month/week_of_year', todayDate);

    fetch(`http://localhost:8000/yelp_api/pickle_views/model-output/${todayDate}/`)
    .then(response => response.json())
    .then(data => {
      console.log('API data', data);
  
      setPicklePredictions(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });  }, []);

    //return the month endpoint
    useEffect(() => {
      fetch('http://localhost:8000/yelp_api/pickle_views/monthly/')
        .then(response => response.json())
        .then(data => {
          console.log('Month data', data);
    
          setYearData(data);
        });
    }, []);
    

  //return the week endpoint for the current week
  useEffect(() => {
    const currentWeek = getWeek();
    console.log("current week", currentWeek);
    fetch(`http://localhost:8000/yelp_api/pickle_views/weekly/${currentWeek}/`)
    .then(response => response.json())
    .then(data => {
      console.log('Week data', data);
      setWeekData(data);
  })
}, []);
  
//sort cafes by tlc taxi zones 
// i need to see if the lat/long of the cafe is within the tlc taxi zone
//the tlc taxi zone is a polygon

const sortCafesByTLC = (data) => {
  fetch('/filtered_geojson_file.geojson')
  .then(response => response.json())
  .then(tlcData => {
    console.log('TLC data', tlcData);
    console.log('Cafe data', data);
    const tlcFeatures = tlcData.features;
    const tlcProperties = tlcFeatures.properties;
    const cafeData = data;
    const cafeList = [];
    //loop through each cafe
    cafeData.forEach(cafe => {
      //loop through each tlc zone
      tlcFeatures.forEach(zone => {
        const polygons = zone.geometry.type === 'Polygon'
          ? [zone.geometry.coordinates]
          : zone.geometry.coordinates;
      
          //if the cafe is within the tlc zone, add it to the cafeList
        polygons.forEach(coordinates => {
          const cafePoint = point([cafe.longitude, cafe.latitude]);
          const zonePolygon = polygon(coordinates);
                    //check if the cafe lat/long is within the tlc zone
        if (booleanPointInPolygon(cafePoint, zonePolygon)) {

          //add geojson properties to our cafe object here 
          cafe['objectid'] = zone.properties.objectid;

          //if true, add the cafe to the cafeList
          cafeList.push(cafe);
        }
      }
    )
    })
    setSortedCafes(cafeList);
  })
})
}

//make an array showing how many cafes in each tlc zone (objectid)
// {objectid: count}

const fetchGeoJson = () => {  
  fetch('/filtered_geojson_file.geojson')
  .then(response => response.json())
  .then(data => {
    // console.log('TLC data', data);
    setTaxiGeoJson(data);
  })
}


const filterCafeDensity = (sortedCafes) => {
  const cafeDensity = {};

    // convert the string to an array
    const objectIdArray = objectIds.split(', ').map(id => id.trim());
  
  // initialize all objectIds in cafeDensity to 0
  objectIdArray.forEach(objectId => {
    cafeDensity[objectId] = 0;
  });

  // increment count for each objectId that gets hit
  sortedCafes.forEach(cafe => {
    if (cafeDensity.hasOwnProperty(cafe.objectid)) {
      cafeDensity[cafe.objectid] += 1;
    }
  });
  
  setCafeDensity(cafeDensity);
}

useEffect(() => {
  fetchGeoJson();
  }, []);



  useEffect(() => {
    sortCafesByTLC(data);
  },[data]);

  useEffect(() => {
    console.log('sorted cafes', sortedCafes);
    filterCafeDensity(sortedCafes);
    }, [sortedCafes])

    useEffect(() => {
      console.log('cafe density', cafeDensity);
      }, [cafeDensity])

  return (
    <ApiContext.Provider value={[data, setData, reviews, setReviews, picklePredictions, setPicklePredictions, yearData, setYearData, weekData, setWeekData, sortedCafes, setSortedCafes, cafeDensity]}>
      {children}
    </ApiContext.Provider>
  );
}
export default Store;
