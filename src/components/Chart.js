import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import React, { useState } from "react";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

export const Chart = ({ initialData = [] }) => {
  const [data, setData] = useState([]);
  if (data !== initialData) setData(initialData);
  console.log(data[1]);
  if (!data[0]) {
    return <div>Data is not available</div>;
  }
  return (
    <div style={{ width: "1000px", height: "500px" }}>
      <Bar
        data={{
          labels: data[0].map((data) => data.time),
          datasets: [
            {
              label: "Ravenue",
              data: [20, 30, 40],
            },
            {
              label: "Loss",
              data: data ? data[0].map((data) => data.amount) : [1, 1, 1],
            },
          ],
        }}
      ></Bar>
      <Line
        data={{
          labels: data[1].map((data) => data.date),
          datasets: [
            {
              label: "Temperature",
              data: data[1].map((data) => data.amount),
              backgroundColor: "#064FF0",
              borderColor: "#064FF0",
            },
          ],
        }}
        options={{
          elements: {
            line: {
              tension: 0.5,
            },
          },
          plugins: {
            title: {
              text: "Temperature Chart",
            },
          },
        }}
      ></Line>
    </div>
  );
};
