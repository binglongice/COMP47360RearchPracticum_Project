import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiContext.js';


const BusynessSlider = ({hour, setHour}) => {

    const [activeHour, setActiveHour] = useState('');
    const [activeDay, setActiveDay] = useState('');
    const [activeMonth, setActiveMonth] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // const [sliderChecked, setSliderChecked] = useState({
    //     day: true,
    //     week: false,
    //     year: false,
    // });
    const [selectedTimeframe, setSelectedTimeframe] = useState('day');
    
    //sets the active hour to the hour selected on the slider
    //if the hour is >= 12, it is PM, otherwise it is AM
    //if the hour is 0, it is 12 AM
    //hour  is the slider index, if month is selected than the index is 0-11 and it will pick the correct month
    useEffect(() => {
        const ampm = activeIndex >= 12 ? 'PM' : 'AM';
        const hour12 = activeIndex % 12 ? activeIndex % 12 : 12;
        setActiveHour(`${hour12} ${ampm}`);
        setActiveDay(days[activeIndex % 7]); // use modulo 7 to prevent out of index errors
        setActiveMonth(months[activeIndex % 12]); // use modulo 12 to prevent out of index errors
    }, [activeIndex]);

    const handleSliderChange = (event) => {
        const index = parseInt(event.target.value);
        setActiveIndex(index);
        setHour(index);
    }

    const handleTimeframeChange = (event) => {
        setSelectedTimeframe(event.target.value);
    }

    let displayTimeframe = 'Hour';
    let displayValue = activeHour;
    let maxRange = 23;
    let inputValue = hour;

    if (selectedTimeframe === 'day') {
        displayTimeframe = 'Hour';
        displayValue = activeHour;
        inputValue = 
        maxRange = 23;
    } else if (selectedTimeframe === 'week') {
        displayTimeframe = 'Day';
        displayValue = activeDay;
        maxRange = 6;
    } else if (selectedTimeframe === 'year') {
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
            <input id = "day" type='radio' name='toggle' value='day' checked={selectedTimeframe === 'day'} onChange={handleTimeframeChange}/>
            <label htmlFor='day'>Day</label>
            <input id = "week" type='radio' name='toggle' value='week' checked={selectedTimeframe === 'week'} onChange={handleTimeframeChange}/>
            <label htmlFor='week'>Week</label>
            <input id = "year" type='radio' name='toggle' value='year' checked={selectedTimeframe === 'year'} onChange={handleTimeframeChange}/>
            <label htmlFor='year'>Year</label>
        </div>
    </div>
    );
}


export default BusynessSlider;