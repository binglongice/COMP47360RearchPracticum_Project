import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';

const TakeOutButton = ({takeOut, setTakeOut, setRunTakeOut}) => {
    

    const handleHeatMap = () => {
        setTakeOut(takeOut => !takeOut); // toggle between true and false // toggle between 0 and 1
        setRunTakeOut(true);
    }

    return (
        <button aria-label="Takeout Radius"className = "takeOutButton" onClick={handleHeatMap}>
                       <FontAwesomeIcon icon={faBicycle} /> 
        <span>Delivery</span>

        
        </button>
    )

} 

export default TakeOutButton;