import React, { useState, useEffect } from 'react';

const HeatMapButton = ({heatMap, setHeatMap}) => {
    

    const handleHeatMap = () => {
        setHeatMap(heatMap === 0 ? 1 : 0); // toggle between 0 and 1
    }


    return (
        <button className = "HeatMapButton" onClick={handleHeatMap}>Customize Heatmap</button>
    )

} 

export default HeatMapButton;