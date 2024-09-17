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
          speed:'3' // Umożliwia zoomowanie za pomocą scrolla
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


export const Chart = ({ initialData = [], thresholds = [], predictiveDataPar= [] }) => {
  const [data, setData] = useState([]);
  const [predictiveData, setPredictiveData] = useState([]);
  const [thresh, setThresh] = useState(thresholds);
  const [width, setWidth] = useState(2000); // Początkowa szerokość wykresu


 // Create refs for both charts to control zoom/pan
 const lineChartRef = useRef(null);
 const barChartRef = useRef(null);

  useEffect(() => {
    if(thresholds != thresh){
    setThresh(thresholds);
  }}, [thresholds]); 
  useEffect(() => {
  if (lineChartRef.current && barChartRef.current) {
    const lineChart = lineChartRef.current;
    const barChart = barChartRef.current;
    lineChart.zoom(1.8); // Set initial zoom level for line chart
    barChart.zoom(1.8);  // Set initial zoom level for bar chart
  }
}, [data]);
  //console.log(thresholds);
  if (data !== initialData || predictiveData!==predictiveDataPar) {
    setData(initialData);
    setPredictiveData(predictiveDataPar);
  }
  if (!data[0]) {
    return <>;
 {/* Bar Chart with Zoom Buttons */}
 <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", padding: "20px" }}>
 <div style={{ width: "100%" }}>
   <div style={{ height: "500px", width: `${width}px` }}>
   <Bar
  ref={barChartRef} // Reference to the Bar chart
  data={{
    labels: predictiveData.map((data) =>
      data.date.split('T')[0]
    ),
    datasets: [
      {
        label: "Predicted amount",
        data: predictiveData.map((data) => data.predicted_count),
        backgroundColor: predictiveData.map((data) =>
          'blue'
          //data.predicted_count > thresh[1] ? "red" : data.predicted_count > thresh[0] ? "orange" : data.predicted_count < 23 ? "blue" : "orange"
        ),
      },
      {
        label: "Real amount",
        data: predictiveData.map((data) => data.recorded_count),
        backgroundColor: predictiveData.map((data) =>
          //data.recorded_count > thresh[1] ? "black" : data.recorded_count > thresh[0] ? "yellow" : data.recorded_count < 23 ? "lightgreen" : "yellow"
        'lightgreen'
      ),
      },
    ],
  }}
  options={{
    ...options,
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: function(chart) {
            return [
              {
                text: 'Real data',
                fillStyle: 'lightgreen', // Color matching the condition in the 'Predicted amount' dataset
              },
              {
                text: 'Predicted data',
                fillStyle: 'blue', // Color matching the condition in the 'Predicted amount' dataset
              },
              {
                text: 'High Risk',
                fillStyle: 'red', // Color for 'Real amount' dataset > Threshold 1
              },
              {
                text: 'Warning',
                fillStyle: 'orange', // Color for 'Real amount' dataset > Threshold 0
              },
              {
                text: 'Low Risk',
                fillStyle: 'green', // Color for 'Real amount' dataset < 23
              }
            ];
          }
        }
      },
      title: {
        display: true,
        text: "Predictive Anomaly Amount",
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: 23,
            borderColor: 'orange',
            borderWidth: 2,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: 28,
            borderColor: 'red',
            borderWidth: 3,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: 15,
            borderColor: 'green',
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
     </div><div>Filterd Data is not available</div></>

  }

  const zoomIn = (chartRef) => {
    chartRef.current.zoom(1.2); // Zoom in 20%

    updateWidth(1.2); // Zwiększ szerokość wykresu

  };

  const zoomOut = (chartRef) => {
    chartRef.current.zoom(0.8); // Zoom out 20%
    if(width >= 2000 )
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
{/* Bar Chart with Zoom Buttons */}
<div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", padding: "20px" }}>
 <div style={{ width: "100%" }}>
   <div style={{ height: "500px", width: `${width}px` }}>
   <Bar
  ref={barChartRef} // Reference to the Bar chart
  data={{
    labels: predictiveData.map((data) =>
      data.date.split('T')[0]
    ),
    datasets: [
      {
        label: "Predicted amount",
        data: predictiveData.map((data) => data.predicted_count),
        backgroundColor: predictiveData.map((data) =>
          'blue'
          //data.predicted_count > thresh[1] ? "red" : data.predicted_count > thresh[0] ? "orange" : data.predicted_count < 23 ? "blue" : "orange"
        ),
      },
      {
        label: "Real amount",
        data: predictiveData.map((data) => data.recorded_count),
        backgroundColor: predictiveData.map((data) =>
          //data.recorded_count > thresh[1] ? "black" : data.recorded_count > thresh[0] ? "yellow" : data.recorded_count < 23 ? "lightgreen" : "yellow"
        'lightgreen'
      ),
      },
    ],
  }}
  options={{
    ...options,
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: function(chart) {
            return [
              {
                text: 'Real data',
                fillStyle: 'lightgreen', // Color matching the condition in the 'Predicted amount' dataset
              },
              {
                text: 'Predicted data',
                fillStyle: 'blue', // Color matching the condition in the 'Predicted amount' dataset
              },
              {
                text: 'High Risk',
                fillStyle: 'red', // Color for 'Real amount' dataset > Threshold 1
              },
              {
                text: 'Warning',
                fillStyle: 'orange', // Color for 'Real amount' dataset > Threshold 0
              },
              {
                text: 'Low Risk',
                fillStyle: 'green', // Color for 'Real amount' dataset < 23
              }
            ];
          }
        }
      },
      title: {
        display: true,
        text: "Predicted Anomaly Amount",
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: 23,
            borderColor: 'orange',
            borderWidth: 2,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: 28,
            borderColor: 'red',
            borderWidth: 3,
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: 15,
            borderColor: 'green',
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
                    label: " Filtered Data Temperature",
                    data: data.map((data) => data.value),
                    backgroundColor: data.map((data) =>
                      data.value > thresh[1] ? "red" : data.value > thresh[0] ? "orange" : data.value < 23 ? "blue" : "green"
                    ),
                  },
                ],
              }}
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  legend: {
                    display: true,
                    labels: {
                      generateLabels: function(chart) {
                        return [
                          {
                            text: 'Normal condition ',
                            fillStyle: 'green', // Color matching the condition in the 'Predicted amount' dataset
                          },
                          {
                            text: 'High Risk',
                            fillStyle: 'red', // Color for 'Real amount' dataset > Threshold 1
                          },
                          {
                            text: 'Warning',
                            fillStyle: 'orange', // Color for 'Real amount' dataset > Threshold 0
                          },
                          {
                            text: 'Warning Line',
                            fillStyle: 'blue', // Color for 'Real amount' dataset > Threshold 0
                          },
                          {
                            text: 'Critical Line',
                            fillStyle: 'red', // Color for 'Real amount' dataset > Threshold 0
                          },
                        ];
                      }
                    }
                  },
                  title: {
                    text: " Filtered Data Temperature",
                  },
                  annotation: {
                    annotations: [
                      {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: thresh[0],
                        borderColor: 'blue',
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
                  ...options.plugins, legend: {
                    display: true,
                    labels: {
                      generateLabels: function(chart) {
                        return [
 
                          {
                            text: 'High Risk',
                            fillStyle: 'red', // Color for 'Real amount' dataset > Threshold 1
                          },
                          {
                            text: 'Warning',
                            fillStyle: 'orange', // Color for 'Real amount' dataset > Threshold 0
                          },
                        ];
                      }
                    }
                  },
                  title: {
                    text: "Temperature ",
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
    </div>
  );
};