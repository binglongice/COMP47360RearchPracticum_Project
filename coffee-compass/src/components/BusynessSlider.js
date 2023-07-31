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
  
const BusynessSlider = ({selectedTimeFrame, setSelectedTimeFrame, activeIndex, setActiveIndex}) => {
    
    const [activeHour, setActiveHour] = useState(getHour());
    const [activeDay, setActiveDay] = useState(getDay);
    const [activeMonth, setActiveMonth] = useState(getMonth);
    // const [activeIndex, setActiveIndex] = useState(getHour());
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // useEffect(() => {
    //     switch(selectedTimeFrame) {
    //         case 'day':
    //             setActiveIndex(getHour());
    //             break;
    //         case 'week':
    //             setActiveIndex(getDay());
    //             break;
    //         case 'year':
    //             setActiveIndex(getMonth());
    //             break;
    //         default:
    //             setActiveIndex(getHour());
    //     }
    // }, [selectedTimeFrame]);

    useEffect(() => {
        setActiveIndex(0);
    }, [selectedTimeFrame]);


    useEffect(() => {
        let maxIndex;
        switch(selectedTimeFrame) {
            case 'day':
                maxIndex = 23;
                break;
            case 'week':
                maxIndex = 6;
                break;
            case 'year':
                maxIndex = 11;
                break;
            default:
                maxIndex = 23;
        }
        setActiveIndex(prevIndex => Math.min(prevIndex, maxIndex));
    }, [selectedTimeFrame]);
    
    

    useEffect(() => {
        const ampm = activeIndex >= 12 ? 'PM' : 'AM';
        const hour12 = activeIndex % 12 === 0 ? 12 : activeIndex % 12;
        setActiveHour(`${hour12} ${ampm}`);
        setActiveDay(days[activeIndex]);
        setActiveMonth(months[activeIndex]);
        console.log(activeIndex)
    }, [activeIndex]);

const handleSliderChange = (event) => {
    const index = parseInt(event.target.value);
    setActiveIndex(index);
}
    const handleTimeframeChange = (event) => {
        setSelectedTimeFrame(event.target.value);
    }

    let displayTimeframe = 'Hour';
    let displayValue = activeHour;
    let maxRange = 23;
    let inputValue = activeIndex;

    if (selectedTimeFrame === 'day') {
        displayTimeframe = 'Hour';
        displayValue = activeHour;
        inputValue = activeIndex;
        maxRange = 23;
    } else if (selectedTimeFrame === 'week') {
        displayTimeframe = 'Day';
        displayValue = activeDay;
        inputValue = activeIndex;
        maxRange = 6;
    } else if (selectedTimeFrame === 'year') {
        displayTimeframe = 'Month';
        displayValue = activeMonth;
        inputValue = activeIndex;
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