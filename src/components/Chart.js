import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import React, { useState,useEffect } from "react";
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
          modifierKey: 'ctrl', // Umożliwia zoomowanie za pomocą scrolla
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
  const [start,setStart] = useState(true);
  const [thresh, setThresh] = useState(thresholds);
 

  useEffect(() => {
    if(thresholds != thresh){
    setThresh(thresholds);
  }}, [thresholds]); 
 

  console.log(thresholds);
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
    <div>
      {/* Kontener z suwakiem poziomym dla pierwszego wykresu */}
      <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", padding: "20px" }}>
        <div style={{ width: "2000px" }}>
          {/* Wykres liniowy */}
          <div style={{ height: "500px" }}>
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
                        label: {
                          enabled: false,
                          content: 'Test label'
                        }
                      },
                      {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: thresh[1],
                        borderColor: 'red',
                        borderWidth: 3,
                        label: {
                          enabled: false,
                          content: 'Test label'
                        }
                      }
                    ]
                  }
                  
                },
              }}
              
            />
          </div>
        </div>
      </div>

      {/* Kontener z suwakiem poziomym dla drugiego wykresu */}
      <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", padding: "20px" }}>
        <div style={{ width: "2000px" }}>
          {/* Wykres słupkowy */}
          <div style={{ height: "500px" }}>
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
                        label: {
                          enabled: false,
                          content: 'Test label'
                        }
                      },
                      {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: thresh[1],
                        borderColor: 'red',
                        borderWidth: 3,
                        label: {
                          enabled: false,
                          content: 'Test label'
                        }
                      }
                    ]
                  }
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};