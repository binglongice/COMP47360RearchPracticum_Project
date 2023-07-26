import { Container } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const rankToColor = d3.scaleLinear()
  .domain([1, 33])  // Input: Rank ranges from 1 to 33
  .range(['hsl(120, 100%, 25%)', 'hsl(120, 100%, 60%)']);  // Output: Corresponding lightness from 25% to 60%




const levels = Array.from({length: 11}, (_, i) => {
  const value = i / 10;
  const rank = value * 33;  // Map value from 0-1 to rank 1-33
  return {
    color: rankToColor(rank),
    value: value,
  };
});

const Legend = () => { 
  const [width, setWidth] = useState(60); 
  const [height, setHeight] = useState(100);
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    const svg = d3.select('#legend-svg');
    setSvg(svg);    
    const { width, height } = svg.node().getBoundingClientRect();  
    setWidth(width);
    setHeight(height);  
  }, []);

  useEffect(() => {
    if (svg) {
      const defs = svg.append('defs');
  
      const linearGradient = defs
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
  
      linearGradient
        .selectAll('stop')  
        .data(levels)
        .enter()
        .append('stop')
        .attr('offset', (d) => `${d.value * 100}%`)
        .attr('stop-color', (d) => d.color);
  
      svg
        .append('rect')
        .attr('width', 20)
        .attr('height', height)
        .style('fill', 'url(#linear-gradient)');
  
      svg.append('text')
        .attr('x', 30)
        .attr('y', 10)
        .style('fill', 'white')
        .text('1');
      
      svg.append('text')
        .attr('x', 30)
        .attr('y', height)
        .style('fill', 'white')
        .text('0');


        svg.append('text')
        .attr('x', 30)
        .attr('y', height/2)
        .style('fill', 'white')
        .text('0.5');
    }

    
  }, [svg, width, height]);
  
  return (
    <div className="legend">
      <h4>Busyness</h4>
      <svg id="legend-svg" width="50" height="100" />
    </div>
  );
};

export default Legend;
