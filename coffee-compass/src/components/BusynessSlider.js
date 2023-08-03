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
  
const BusynessSlider = ({selectedTimeFrame, setSelectedTimeFrame, activeIndex, setActiveIndex}) => {
    //hours = 0-23
    const hours = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM","2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM","10PM", "11PM"]
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    useEffect(() => {
        let maxIndex;
        let newActiveIndex;
        switch(selectedTimeFrame) {
            case 'day':
                newActiveIndex = getHour();
                maxIndex = 23;
                break;
            case 'week':
                newActiveIndex = getDay();
                maxIndex = 6;
                break;
            case 'year':
                newActiveIndex = getMonth();
                maxIndex = 11;
                break;
            default:
                newActiveIndex = getHour();
                maxIndex = 23;
        }
        setActiveIndex(Math.min(newActiveIndex, maxIndex));
    }, [selectedTimeFrame, setActiveIndex]);

    const handleSliderChange = (event) => {
        const index = parseInt(event.target.value);
        setActiveIndex(index);
    }

    const handleTimeframeChange = (event) => {
        setSelectedTimeFrame(event.target.value);
    }

    let displayTimeframe;
    switch(selectedTimeFrame) {
        case 'day':
            displayTimeframe = 'Hour';
            break;
        case 'week':
            displayTimeframe = 'Day';
            break;
        case 'year':
            displayTimeframe = 'Month';
            break;
        default:
            displayTimeframe = 'Hour';
    }

    //if selectedTimeFrame is day, display hours, if week, display days, if year, display months
    const displayValue = selectedTimeFrame === 'day' ? hours[activeIndex] : selectedTimeFrame === 'week' ? days[activeIndex] : months[activeIndex]
    const maxRange = selectedTimeFrame === 'day' ? 23 : selectedTimeFrame === 'week' ? 6 : 11;

    return (
    <div className="BusynessSliderBox">
        <h3>Busyness Slider</h3>
        <div className='session'>
            <h2>
                
                {/*{displayTimeframe}: {" "}*/}


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
