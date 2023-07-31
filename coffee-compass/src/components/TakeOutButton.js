import React, { useState, useEffect } from 'react';

const TakeOutButton = ({takeOut, setTakeOut}) => {
    

    const handleHeatMap = () => {
        setTakeOut(takeOut => !takeOut); // toggle between true and false // toggle between 0 and 1
    }

    return (
        <button className = "takeOutButton" onClick={handleHeatMap}>Take Out Radius</button>
    )

} 

export default TakeOutButton;