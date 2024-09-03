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
    <div style={{ width: "1000px", height: "500px", marginLeft: "4%" }}>
      <Line
        data={{
          labels: data.map((data) =>
            data.date.replace("1900-", " ").replace("T", " ").replace("Z", "")
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
            data.date.replace("1900-", " ").replace("T", " ").replace("Z", "")
          ),
          datasets: [
            {
              label: "Risk of failure",
              data: [10, 10, 10, 12, 12, 14, 14, 16, 16, 18, 16, 18],
              backgroundColor: "red",
            },
            {
              label: "Temperature",
              data: data ? data.map((data) => data.value) : [1, 1, 1],
              backgroundColor: "lightblue",
            },
          ],
        }}
      ></Bar>
    </div>
  );
};
