import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import React, { useState,useRef,useEffect } from "react";
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(annotationPlugin);

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
      text: "Temperature Chart",
    },
    zoom: {
      pan: {
        modifierKey: 'ctrl',
        enabled: true, // Umożliwia przesuwanie w poziomie
        mode: 'x',
      },
      zoom: {
        
        enabled: true, // Umożliwia zoomowanie w poziomie
        mode: 'x',
        drag: true, // Umożliwia zoomowanie przez przeciąganie
        wheel: {
          enabled: true,
          modifierKey: 'ctrl',
          speed:'2' // Umożliwia zoomowanie za pomocą scrolla
        },
        pinch: {
          enabled: true,
          modifierKey: 'ctrl', // Umożliwia pinch zoom (dla urządzeń dotykowych)
        },
        limits: {
          x: { min: 0, max: 100 }, // Minimalne i maksymalne wartości zoomu
        },
      },
    },
  },
};


export const Chart = ({ initialData = [], thresholds = [] }) => {
  const [data, setData] = useState([]);
  const [thresh, setThresh] = useState(thresholds);
  const [width, setWidth] = useState(2000); // Początkowa szerokość wykresu


 // Create refs for both charts to control zoom/pan
 const lineChartRef = useRef(null);
 const barChartRef = useRef(null);

  useEffect(() => {
    if(thresholds != thresh){
    setThresh(thresholds);
  }}, [thresholds]); 
 

  console.log(thresholds);
  if (data !== initialData) {
    setData(initialData);
  }
  if (!data[0]) {
    return <div>Data is not available</div>;
  }

  const zoomIn = (chartRef) => {
    chartRef.current.zoom(1.2); // Zoom in 20%
    updateWidth(1.2); // Zwiększ szerokość wykresu

  };

  const zoomOut = (chartRef) => {
    chartRef.current.zoom(0.8); // Zoom out 20%
    updateWidth(0.8); // Zmniejsz szerokość wykresu

  };

  const resetZoom = (chartRef) => {
    chartRef.current.resetZoom();
    setWidth(2000); // Reset szerokości do początkowej wartości
  };

  const updateWidth = (factor) => {
    setWidth((prevWidth) => prevWidth * factor);
  };

  let start_date = new Date(data[0].date);
  let end_date = new Date(data[data.length-1].date);

  let range_min = new Date(data[0].date);  //start date
  range_min.setDate(range_min.getDate()-10);

  let range_max = new Date(data[data.length-1].date);  //end date
  range_max.setDate(range_max.getDate()+10);

  return (
    <div>
      {/* Line Chart with Zoom Buttons */}
      <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", padding: "20px" }}>
        <div style={{ width: "100%  " }}>
          <div style={{ height: "500px", width: `${width}px` }}>
            <Line
              ref={lineChartRef} // Reference to the Line chart
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
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    text: "Zoomable Temperature Chart",
                  },
                  annotation: {
                    annotations: [
                      {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: thresh[0],
                        borderColor: 'orange',
                        borderWidth: 2,
                      },
                      {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: thresh[1],
                        borderColor: 'red',
                        borderWidth: 3,
                      }
                    ]
                  }
                },
              }}
            />
          </div>
        </div>
        <div>
              <button style = {{color:"black"}} onClick={() => zoomIn(lineChartRef)}>Zoom In</button>
              <button style = {{color:"black"}} onClick={() => zoomOut(lineChartRef)}>Zoom Out</button>
              <button style = {{color:"black"}} onClick={() => resetZoom(lineChartRef)}>Reset Zoom</button>
            </div>
      </div>

      {/* Bar Chart with Zoom Buttons */}
      <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", padding: "20px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ height: "500px", width: `${width}px` }}>
            <Bar
              ref={barChartRef} // Reference to the Bar chart
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
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    text: "Zoomable Temperature Bar Chart",
                  },
                  annotation: {
                    annotations: [
                      {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: thresh[0],
                        borderColor: 'yellow',
                        borderWidth: 2,
                      },
                      {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: thresh[1],
                        borderColor: 'red',
                        borderWidth: 3,
                      }
                    ]
                  }
                },
              }}
            />

          </div>
        </div>
      </div>
      <div>
              <button style = {{color:"black"}} onClick={() => zoomIn(barChartRef)}>Zoom In</button>
              <button style = {{color:"black"}} onClick={() => zoomOut(barChartRef)}>Zoom Out</button>
              <button style = {{color:"black"}} onClick={() => resetZoom(barChartRef)}>Reset Zoom</button>
            </div>
    </div>
  );
};