import { Container } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import React, { useState, useEffect } from 'react';

//I want to create a linaer gradient that changes color based on the busyness of the cafe from 0 to 1 (0 being not busy, 1 being very busy)
// The gradient should be in a box that is 100px by 20px
// The gradient should be horizontal
// The gradient should be on top of the map componenet


function Legend() {
    return (
      <div className="legend">
        <h4>Busyness</h4>
        <div>
            <span style={{ backgroundColor: '#00ff00' }}></span>0
        </div>
        <div>
            <span style={{ backgroundColor: '#33ff00' }}></span>0.1
        </div>
        <div>
            <span style={{ backgroundColor: '#66ff00' }}></span>0.2
        </div>
        <div>
            <span style={{ backgroundColor: '#99ff00' }}></span>0.3
        </div>
        <div>
            <span style={{ backgroundColor: '#ccff00' }}></span>0.4
        </div>
        <div>
            <span style={{ backgroundColor: '#ffff00' }}></span>0.5
        </div>
        <div>
            <span style={{ backgroundColor: '#ffcc00' }}></span>0.6
        </div>
        <div>
            <span style={{ backgroundColor: '#ff9900' }}></span>0.7
        </div>
        <div>
            <span style={{ backgroundColor: '#ff6600' }}></span>0.8
        </div>
        <div>
            <span style={{ backgroundColor: '#ff3300' }}></span>0.9
        </div>
        <div>
            <span style={{ backgroundColor: '#ff0000' }}></span>1
        </div>
    </div>
    );
  }
  
  export default Legend;


//   if (score < 0.1) {
//     return '#00ff00';
//   }
//   if (score < 0.2) {
//     return '#33ff00';
//   }
//   if (score < 0.3) {
//     return '#66ff00';
//   }
//   if (score < 0.4) {
//     return '#99ff00';
//   }
//   if (score < 0.5) {
//     return '#ccff00';
//   }
//   if (score < 0.6) {
//     return '#ffff00';
//   }
//   if (score < 0.7) {
//     return '#ffcc00';
//   }
//   if (score < 0.8) {
//     return '#ff9900';
//   }
//   if (score < 0.9) {
//     return '#ff6600';
//   }
//   if (score < 1.0) {
//     return '#ff3300';
//   }
//   if (score < 1.2) {
//     return '#ffc000';
//   }    