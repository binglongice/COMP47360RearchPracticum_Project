import React, { useState, useEffect } from 'react';

const getHour = () => {
    const today = new Date();
    return today.getHours();
  }
  
const getDay = () => {
const today = new Date();
return today.getDay();
}

const getMonth = () => {
    const today = new Date();
    return today.getMonth();
}
  

//useStates are out of sync with each other
//This causes the slider to be jumpy when switchign between timeframes
//when day is selected a second time it returns the incorrect hour (switches to am instead of pm)
  
const BusynessSlider = ({selectedTimeFrame, setSelectedTimeFrame, hour, setHour}) => {

    const [activeHour, setActiveHour] = useState(getHour());
    const [activeDay, setActiveDay] = useState(getDay);
    const [activeMonth, setActiveMonth] = useState(getMonth);
    const [activeIndex, setActiveIndex] = useState(getHour());
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    //sets the active hour to the hour selected on the slider
    let day = (getDay() - 1);
    let month = (getMonth());
    useEffect(() => {
        // a variable that returns the index of the current day from days array
  
    console.log("switch", activeIndex)
        switch(selectedTimeFrame) {
          case 'day':
            setActiveIndex(hour);
            setHour(hour);
            break;
          case 'week':
            setActiveIndex(day);
            setHour(day);
            break;
          case 'year':
            setActiveIndex(month);
            setHour(month)
            break;
          default:
            setActiveIndex(hour);
            setHour(hour)
        }
      }, [selectedTimeFrame]);







    //if the hour is >= 12, it is PM, otherwise it is AM
    //if the hour is 0, it is 12 AM
    //hour  is the slider index, if month is selected than the index is 0-11 and it will pick the correct month
    useEffect(() => {
        const ampm = activeIndex >= 12 ? 'PM' : 'AM';
        const hour12 = activeIndex % 12 === 0 ? 12 : activeIndex % 12;
        setActiveHour(`${hour12} ${ampm}`);
        setActiveDay(days[activeIndex % 7]); 
        setActiveMonth(months[activeIndex % 12]);     }, [activeIndex]);

    const handleSliderChange = (event) => {
        const index = parseInt(event.target.value);
        setActiveIndex(index);
        setHour(index);
    }

    const handleTimeframeChange = (event) => {
        setSelectedTimeFrame(event.target.value);
    }

    let displayTimeframe = 'Hour';
    let displayValue = activeHour;
    let maxRange = 23;
    let inputValue = hour;

    if (selectedTimeFrame === 'day') {
        displayTimeframe = 'Hour';
        displayValue = activeHour;
        inputValue = 
        maxRange = 23;
    } else if (selectedTimeFrame === 'week') {
        displayTimeframe = 'Day';
        displayValue = activeDay;
        maxRange = 6;
    } else if (selectedTimeFrame === 'year') {
        displayTimeframe = 'Month';
        displayValue = activeMonth;
        maxRange = 11;
    }


return (
    <div className="BusynessSliderBox">
        <h3>Busyness Slider</h3>
        <div className='session'>
            <h2>{displayTimeframe}: {" "}
            <label>{displayValue}</label>
            </h2> 
            <input className='row' type='range' min='0' max={maxRange} step='1' value={activeIndex} onChange={handleSliderChange} />
        </div>
        <div className='filter_row'>
            <h2>Time Scale</h2>
            <input id = "day" type='radio' name='toggle' value='day' checked={selectedTimeFrame === 'day'} onChange={handleTimeframeChange}/>
            <label htmlFor='day'>Day</label>
            <input id = "week" type='radio' name='toggle' value='week' checked={selectedTimeFrame === 'week'} onChange={handleTimeframeChange}/>
            <label htmlFor='week'>Week</label>
            <input id = "year" type='radio' name='toggle' value='year' checked={selectedTimeFrame === 'year'} onChange={handleTimeframeChange}/>
            <label htmlFor='year'>Month</label>
        </div>
    </div>
    );
}


export default BusynessSlider;