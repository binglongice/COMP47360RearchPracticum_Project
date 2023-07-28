import React, { useState, useEffect, useContext} from 'react';
import { ApiContext } from '../context/ApiContext';
import { Line } from "react-chartjs-2";

//{chartFlag && currentObjectId &&  <LineChart dayData = {busyness} weekData = {weekRankData} yearData = {yearRankData} objectID = {currentObjectId}/>}

function LineChart({ dayData, weekData, yearData, objectid}) {

    const [time, setTime] = useState({
        day: true,
        week: false,
        year: false,
    });

    const [dataForObjectId, setDataForObjectId] = useState(null);
    
    if (time.day) {
    //for the current objectID, get the chartData
    const dataForObjectId = dayData[objectid];  
    }


    return (
        <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Line Chart</h2>
        <Line
            data={dataForObjectId}
            options={{
            plugins: {
                title: {
                display: true,
                text: "Busyness over a 24 Hour Period"
                },
                legend: {
                display: false
                }
            }
            }}
        />
        </div>
    );



    }

export default LineChart;