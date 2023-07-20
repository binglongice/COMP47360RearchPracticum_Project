import { Container } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import React, { useState, useEffect } from 'react';

//I want to create a linaer gradient that changes color based on the busyness of the cafe from 0 to 1 (0 being not busy, 1 being very busy)
// The gradient should be in a box that is 100px by 20px
// The gradient should be horizontal
// The gradient should be on top of the map componenet


import ReactDOM from 'react-dom';
import * as d3 from 'd3';

const levels = [
  { color: '#00ff00', value: 0 },
  { color: '#33ff00', value: 0.1 },
  { color: '#66ff00', value: 0.2 },
  { color: '#99ff00', value: 0.3 },
  { color: '#ccff00', value: 0.4 },
  { color: '#ffff00', value: 0.5 },
  { color: '#ffcc00', value: 0.6 },
  { color: '#ff9900', value: 0.7 },
  { color: '#ff6600', value: 0.8 },
  { color: '#ff3300', value: 0.9 },
  { color: '#ff0000', value: 1 },
];

const gradient = `linear-gradient(to bottom, ${levels.map((level) => level.color).join(', ')})`;

const Legend = () => (
  <div className="legend">
    <h4>Busyness</h4>
    <div className="scale-container" style={{ background: gradient }}>
      <div className="scale-item">
        <span>{levels[0].value}</span>
      </div>
      <div className="scale-item">
        <span>{levels[levels.length - 1].value}</span>
      </div>
    </div>
  </div>
);

export default Legend;

  


