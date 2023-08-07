import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function LineChart({ dayData, weekData, yearData, objectID, sidebarIsOpen }) {
  const [time, setTime] = useState({
    day: true,
    week: false,
    year: false,
  });

  const [chartData, setChartData] = useState(null);
  const [ready, setReady] = useState(false);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Zone Busyness',
        color: 'antiquewhite',
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: chartData?.labels || [],
        ticks: {
          color: 'antiquewhite',
        },
      },
      y: {
        ticks: {
          color: 'antiquewhite', // New color for Y axis labels
        },
      },
    },
  }), [chartData]);
  

  useEffect(() => {
    let rawData;
    let labels;

    if (time.day && dayData) {
      rawData = dayData[objectID];
      labels = ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM','7AM','8AM','9AM','10AM','11AM','12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM','7PM','8PM','9PM','10PM','11PM']
    } else if (time.week && weekData) {
      rawData = weekData[objectID];
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Custom labels for weeks
    } else if (time.year && yearData) {
      rawData = yearData[objectID];
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Custom labels for months
    } else {
      setChartData(null);
      return;
    }

    const formattedData = Object.keys(rawData).map(key => ({ x: Number(key), y: rawData[key] }));

    setChartData({
      labels: labels,
      datasets: [
        {
        //   label: 'Dataset 1',
          data: formattedData,
          borderColor: 'antiquewhite',
          backgroundColor: 'antiquewhite',
        },
      ],
    });
    setReady(true);
  }, [time.day, time.week, time.year, dayData, weekData, yearData, objectID, sidebarIsOpen]);

  const chartKey = useMemo(() => Math.random(), [sidebarIsOpen]);

  return (
    <div className="chart-container">
      <input
        type="radio"
        id="day1"
        name="time"
        value="day"
        checked={time.day}
        onChange={() => setTime({ day: true, week: false, year: false })}
      />
      <label htmlFor="day1">Day</label>
      <input
        type="radio"
        id="week1"
        name="time"
        value="week"
        checked={time.week}
        onChange={() => setTime({ day: false, week: true, year: false })}
      />
      <label htmlFor="week1">Week</label>
      <input
        type="radio"
        id="year1"
        name="time"
        value="year"
        checked={time.year}
        onChange={() => setTime({ day: false, week: false, year: true })}
      />
      <label htmlFor="year1">Year</label>
      {ready && <Line key={chartKey} options={options} data={chartData} />}
    </div>
  );
}

export default LineChart;
