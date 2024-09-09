import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import React, { useState } from "react";
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

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
  let start_date = new Date(data[0].date);
  let end_date = new Date(data[data.length-1].date);

  let range_min = new Date(data[0].date);  //start date
  range_min.setDate(range_min.getDate()-10);

  let range_max = new Date(data[data.length-1].date);  //end date
  range_max.setDate(range_max.getDate()+10);
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
    // scales: {
    //   y: {
    //     type: 'linear',
    //     beginAtZero: true,
    //   },
    //   x: {
    //     type: 'time',
    //     time: {
    //       min: start_date.toDateString(),
    //       max: end_date.toDateString(),
    //       unit: 'day',
    //       stepSize: 1,
    //     },
    //   },
    // },
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
        },
      },
    },
  }}
/>


    </div>
  );
};
