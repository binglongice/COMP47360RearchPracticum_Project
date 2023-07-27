import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiContext.js';


const BusynessSlider = ({busyness, setBusyness, hour, setHour}) => {

    // const [hour, setHour] = useState(12);
    const [activeHour, setActiveHour] = useState('');

    //sets the active hour to the hour selected on the slider
    //if the hour is >= 12, it is PM, otherwise it is AM
    //if the hour is 0, it is 12 AM
    useEffect(() => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 ? hour % 12 : 12;
        setActiveHour(`${hour12} ${ampm}`);
    }, [hour]);

    const handleSliderChange = (event) => {
        const hour = parseInt(event.target.value);
        setHour(hour);
    }

    //24 hour busyness data
// useEffect(() => {
//     console.log("hour: ", hour);
// }, [hour]);

    return (
        <div className="BusynessSliderBox">
            <h3>Busyness Slider</h3>
            <div className='session'>
                <h2>Hour: {" "}
                <label>{activeHour}</label>
                </h2> 
                <input className='row' type='range' min='0' max='23' step='1' accent-color = '#F55050' value={hour} onChange={handleSliderChange} />
            </div>
        </div>
    );
}


export default BusynessSlider;