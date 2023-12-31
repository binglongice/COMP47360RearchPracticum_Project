import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const rankToColor = d3.scaleLinear()
  .domain([1, 66])  // Input: Rank ranges from 1 to 66
  .range(['hsl(120, 100%, 60%)', 'hsl(120, 100%, 25%)']);  // Output: Corresponding lightness from 60% to 25% (light to dark)

const levels = Array.from({length: 11}, (_, i) => {
  const value = i / 10;
  const rank = value * 66;  // Map value from 0-1 to rank 1-66
  return {
    color: rankToColor(rank),
    value: value,
  };
});
const Legend = ({activeMaps}) => { 
  const [width, setWidth] = useState(100);  // Adjust the initial width
  const [height, setHeight] = useState(60);  // Adjust the initial height
  const [svg, setSvg] = useState(null);
  const [title, setTitle] = useState("Busyness");
  console.log("Rendering, title is: ", title);


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
      const gradientHeight = 40; // Set the desired height here (e.g., 40 units)



      const linearGradient = defs
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')  // Make gradient horizontal
        .attr('y2', '0%');
  
      linearGradient
        .selectAll('stop')  
        .data(levels)
        .enter()
        .append('stop')
        .attr('offset', (d) => `${d.value * 100}%`)
        .attr('stop-color', (d) => d.color);
  
        svg
      .attr('height', gradientHeight ); // Adjust the height of the SVG container to accommodate the gradient


      svg
        .append('rect')
        .attr('width', width)  // Adjust rectangle's width and height
        .attr('height', 30)
        .style('fill', 'url(#linear-gradient)');
  
      svg.append('text')
        .attr('x', 5)  // Adjust text's position
        .attr('y', height +3.5)
        .style('fill', 'black')
        .html('<tspan font-size="25px">&#x2639;</tspan>'); // Frown emoticon Unicode character

      // svg.append('text')
      //   .attr('x', width / 2)
      //   .attr('y', height - 5)
      //   .style('fill', 'white')
      //   .text('0.5');

      svg.append('text')
        .attr('x', width - 35)
        .attr('y', height +3.5)
        .style('fill', 'white')
        .html('<tspan font-size="35px">&#x263A;</tspan>'); // Smiley emoticon Unicode character
      }
  }, [svg, width, height]);
  
  
  useEffect(() => {
    const numActive = Object.values(activeMaps).filter(value => value).length;
    
    if (numActive > 1) {
      setTitle('Suitability');
    } else if (activeMaps.busyness) {
      setTitle('Busyness');
    } else if (activeMaps.crimeData) {
      setTitle('Crime');
    } else if (activeMaps.prices) {
      setTitle('Property Prices');
    } else if (activeMaps.transportData) {
      setTitle('Transport Links');
    } else if (activeMaps.cafeDensity) {
      setTitle('Cafe Density');
    } else {
      setTitle('Legend');
    }
  }, [activeMaps]);
  
  return (
    <div className="legend">
      <span>{title}</span>
      <svg id="legend-svg" width="180" height="20" />  
    </div>
  );
};

export default Legend;
