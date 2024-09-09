import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import React, { useState } from "react";
import zoomPlugin from 'chartjs-plugin-zoom';


ChartJS.register(zoomPlugin);

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
    },
    zoom: {
      pan: {
          enabled: true,
          mode: 'x'
      },
      zoom: {
          pinch: {
              enabled: true       // Enable pinch zooming
          },
          wheel: {
              enabled: true       // Enable wheel zooming
          },
          mode: 'x',
      }
  }
  },
};

export const Chart = ({ initialData = [] }) => {
  const [data, setData] = useState([]);
  const [start,setStart] = useState(true);
  if (data !== initialData) {
    // initialData[1] = initialData[1].sort(function (a, b) {
    //   return new Date(a.date) - new Date(b.date);
    // });
    setData(initialData);
  }
  if (!data[0]) {
    return <div>Data is not available</div>;
  }

  return (
    <div style={{ width: "1200px", height: "500px", marginLeft: "2%" }}>
      <Line
        data={{
          labels: data.map((data) =>
            data.date.replace("2024-", " ").replace("T", " ").replace("Z", "").split('.')[0]
          ),
          datasets: [
            {
              label: "Temperature",
              data: data.map((data) => data.value),
              backgroundColor: "#064FF0",
              borderColor: "#064FF0",
            },
          ],
        }}
        options={{
          elements: {
            line: {
              tension: 0.5,
              showLine: false,
            },
          },
          plugins: {
            title: {
              text: "Temperature Chart",
              
            },
          },
        }}
      ></Line>
 <Bar
  data={{
    labels: data.map((data) =>
      data.date.replace("2024-", " ").replace("T", " ").replace("Z", "")
    ),
    datasets: [
      {
        label: "Temperature",
        data: data.map((data) => data.value),
        backgroundColor: data.map((data) =>
          data.value > 32 ? "red" : data.value > 30 ? "orange" : data.value < 23 ? "blue" : "green"
        ),
      },
    ],
  }}
  options={{
    responsive: true,
  scales: {
      
      x: start ? {
        min: 0, // Start at the first data point
        max: 99, // Show up to the 100th data point
      } : {},
    },
    plugins: {
      title: {
        display: true,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          pinch: {
            enabled: true, // Enable pinch zooming
          },
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          mode: 'x',
          onZoomStart:({chart}) => {
            if(start){
              setStart(false);
              chart.options.scales.x.min = undefined;
              chart.options.scales.x.max = undefined;
              chart.update(); 
            } 
          },
          limits: {
            x: {
              min: 0, // Set the minimum limit for x-axis
              max: data.length - 1, // Set the maximum limit for x-axis
              minRange: 3, // Minimum range for zooming
            },
            // y: { min: 10, max: 100 }, // Uncomment and set limits for y-axis if needed
          },
        },
      },
    },
  }}
/>

    </div>
  );
};
