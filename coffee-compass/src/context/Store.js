import React, { useState, useEffect } from 'react';
import { ApiContext } from '../context/ApiContext';
import axios from 'axios';



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
  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [picklePredictions, setPicklePredictions] = useState([]);
  const location = 'Manhattan';
  const [yearData, setYearData] = useState([]); 
  const [weekData, setWeekData] = useState([]); 
  //API fetch request via axios
  //Used to interact with Django endpoint - using GET request
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

    fetch(`http://127.0.0.1:8000/yelp_api/pickle_views/model-output/${todayDate}/`)
    .then(response => response.json())
    .then(data => {
      console.log('API data', data);
  
      // // Initiate an empty hashmap
      // const hashmap = {};
  
      // // Iterate through all keys (hours) in the data object
      // Object.keys(data).forEach(hourKey => {
      //   const hourData = data[hourKey];
  
      //   // For each hour, iterate through all keys (models)
      //   Object.keys(hourData).forEach(modelKey => {
      //     // If the model does not exist in the hashmap, create an empty array
      //     if (!hashmap[modelKey]) {
      //       hashmap[modelKey] = [];
      //     }
  
      //     // Push the model value into the corresponding array
      //     hashmap[modelKey].push(hourData[modelKey]);
      //   });
      // });
  
      // console.log("store keys", Object.keys(data));
      // console.log("testing hashmap for model_4:", hashmap["model_4"]);
      // console.log("hashmap:", hashmap);
      setPicklePredictions(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });  }, []);

    //return the month endpoint
    useEffect(() => {
      fetch('http://127.0.0.1:8000/yelp_api/pickle_views/monthly/')
        .then(response => response.json())
        .then(data => {
          console.log('Month data', data);
    
          // // Create the new data structure
          // let newData = {};
    
          // // Order the months
          // const orderedMonths = Object.keys(data).sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
    
          // // Iterate over each month in orderedMonths
          // for(let month of orderedMonths) {
          //   // Iterate over each model in that month
          //   for(let model in data[month]) {
          //     // If the model doesn't exist in newData, create an empty array for it
          //     if(!newData[model]) {
          //       newData[model] = [];
          //     }
    
          //     // Add the model data to the corresponding model array in newData
          //     newData[model].push(data[month][model]);
          //   }
          // }
    
          // console.log('New data', newData);
          setYearData(data);
        });
    }, []);
    

  //return the week endpoint for the current week
  useEffect(() => {
    const currentWeek = getWeek();
    console.log("current week", currentWeek);
    fetch(`http://127.0.0.1:8000/yelp_api/pickle_views/weekly/${currentWeek}/`)
    .then(response => response.json())
    .then(data => {
      console.log('Week data', data);
      // let newData = {};
      // const orderedWeeks = Object.keys(data).sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));

      // //iterate over each week in orderedWeeks
      // for(let week of orderedWeeks) {
      //   //iterate over each model in that week
      //   for(let model in data[week]) {
      //     //if the model doesn't exist in newData, create an empty array for it
      //     if(!newData[model]) {
      //       newData[model] = [];
      //     }
      //     //add the model data to the corresponding model array in newData
      //     newData[model].push(data[week][model]);
      //   }
      // }
      // console.log('New week data', newData);
      setWeekData(data);
  })
}, []);
  

  return (
    <ApiContext.Provider value={[data, setData, reviews, setReviews, picklePredictions, setPicklePredictions, yearData, setYearData, weekData, setWeekData]}>
      {children}
    </ApiContext.Provider>
  );
}
export default Store;
