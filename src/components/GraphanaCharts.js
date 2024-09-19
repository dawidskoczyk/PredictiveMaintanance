import { GaugeComponent } from 'react-gauge-component';
import React, { useState, useEffect } from "react";
import green from './icons/green.png'; 
import redEng from './icons/redEng.png'; 
import orangeEng from './icons/orangeEng.png'
export const GraphanaCharts = ({ dynamicData = [], thresholds = [], liveData = [], predictiveDataPar= [] }) => {
    const [data, setData] = useState(dynamicData);
    const [thresh, setThresh] = useState(thresholds);
    const [liveDataGraph, setLiveDataGraph] = useState(liveData);
    const [anomalyCount, setAnomalyCount] = useState(0);
    const [critAnomalyCount, setCritAnomalyCount] = useState(0);
    const [thresholdsUpdated, setThresholdsUpdated] = useState(false);
    const [predictiveData, setPredictiveData] = useState([]);




    const countAnomaly = () => {
        const initialValue = 0;
        const initialValue1 = 0;
        const firstDate = liveDataGraph[0].date.split('T')[0];
        const oneDate = [];
    
        liveDataGraph?.forEach((value) => {
            if (value.date.split('T')[0] === firstDate) oneDate.push(value);
        });
    
        console.log('Filtered data for one date:', oneDate);
    
        const thresholdValue0 = parseInt(thresh[0], 10); // Convert thresh[0] to integer
        const thresholdValue1 = parseInt(thresh[1], 10); // Convert thresh[1] to integer
    
        const anomaly = oneDate?.reduce((accumulator, currentValue) => 
            currentValue.value > thresholdValue0 ? accumulator + 1 : accumulator, 
            initialValue
        );
        console.log('Anomaly count:', anomaly);
        setAnomalyCount(anomaly);
    
        const anomalyCrit = oneDate?.reduce((accumulator, currentValue) => 
            currentValue.value > thresholdValue1 ? accumulator + 1 : accumulator, 
            initialValue1
        );
        console.log('Critical anomaly count:', anomalyCrit);
        setCritAnomalyCount(anomalyCrit);
    };
    
    // When thresholds change, update the threshold and set the flag
    useEffect(() => {
        setThresh(thresholds);
        setThresholdsUpdated(true);
    }, [thresholds]);
    
    // Call countAnomaly when thresholds have been updated
    useEffect(() => {
        if (thresholdsUpdated) {
            countAnomaly();
            setThresholdsUpdated(false); // Reset the flag
        }
    }, [thresholdsUpdated]);


    // When dynamic data changes, update data and recalculate anomalies
    useEffect(() => {
        setData(dynamicData);
        //countAnomaly();
    }, [dynamicData]);

    // When live data changes, update live data for the chart
    useEffect(() => {
        setLiveDataGraph(liveData);
    }, [liveData]);

    useEffect(() => {
        setPredictiveData(predictiveDataPar);
        
        if (predictiveDataPar.length > 0 && predictiveDataPar[0].predicted_count !== undefined) {
            console.log(predictiveDataPar[0].predicted_count);
        } else {
            console.log("Predictive data is not available or has no predicted_count.");
        }
    }, [predictiveDataPar]);
    
    return (
        <><div style={{ display: 'flex' }}>
        <div style={{ margin: '25px 20px' }}>
          {(critAnomalyCount / 96) * 100 < 15 && predictiveData.length > 0 && predictiveData[0].predicted_count < 15
            ? <img src={green} alt="Green" style={{ width: '100px', height: '80px' }} />
            : (critAnomalyCount / 96) * 100 < 25 && predictiveData.length > 0 && predictiveData[predictiveData.length - 1].predicted_count < 25
            ? <img src={orangeEng} alt="Orange" style={{ width: '100px', height: '80px' }} />
            : <img src={redEng} alt="Red" style={{ width: '100px', height: '80px' }} />}
        </div>
        <div
          style={{
            color: (critAnomalyCount / 96) * 100 > 25 ? 'red' : ((critAnomalyCount / 96) * 100 < 25 && (critAnomalyCount / 96) * 100 > 15) ? 'orange' : 'green',
            fontWeight: predictiveData.length > 0 && predictiveData[0].predicted_count > 25 ? 'bold' : 'normal',
            fontSize: '28px',
            textAlign: 'center',
            width: '1000px',
            marginTop: '40px'
          }}
        >
          Risk of failure is {((critAnomalyCount / 96) * 100).toPrecision(4)},
          inspection {((critAnomalyCount / 96) * 100 < 15 && predictiveData.length > 0 && predictiveData[predictiveData.length - 1].predicted_count < 15)
            ? "is not required"
            : ((critAnomalyCount / 96) * 100 < 15 && predictiveData.length > 0 && predictiveData[predictiveData.length - 1].predicted_count > 15)
            ? "is not required, but the condition must be monitored as getting worse is expected"
            : ((critAnomalyCount / 96) * 100 < 25 && predictiveData.length > 0 && predictiveData[predictiveData.length - 1].predicted_count < 25)
            ? 'is required within 1 month and its condition may become progressively worse'
            : ((critAnomalyCount / 96) * 100 < 25 && predictiveData.length > 0 && predictiveData[predictiveData.length - 1].predicted_count > 25)
            ? 'is required within 1 month and its condition may become progressively worse'
            : ((critAnomalyCount / 96) * 100 > 25 && predictiveData.length > 0 && predictiveData[predictiveData.length - 1].predicted_count < 25)
            ? 'is required within 1 week and its condition should be closely monitored'
            : 'is required within 1 week and its condition should be closely monitored'}
      </div></div>
        <div style={{ display: 'flex',justifyContent: "center", margin: "0 auto", marginTop: "5%", marginBottom: "5%"}}>
            <div>
                <h5>Actual Temperature of device</h5>
                <GaugeComponent
                    type="semicircle"
                    arc={{
                        width: 0.2,
                        padding: 0.005,
                        cornerRadius: 1,
                        subArcs: [
                            { limit: 20, color: '#EA4228', showTick: true, tooltip: { text: 'Too low temperature!' }},
                            { limit: 23, color: '#F5CD19', showTick: true, tooltip: { text: 'Low temperature!' }},
                            { limit: thresh[0], color: '#5BE12C', showTick: true, tooltip: { text: 'OK temperature!' }},
                            { limit: thresh[1], color: '#F5CD19', showTick: true, tooltip: { text: 'High temperature!' }},
                            { color: '#EA4228', tooltip: { text: 'Too high temperature!' }}
                        ]
                    }}
                    pointer={{
                        color: '#345243',
                        length: 0.80,
                        width: 15
                    }}
                    labels={{
                        valueLabel: { formatTextValue: value => value + 'ºC' },
                        tickLabels: {
                            type: 'outer',
                            valueConfig: { formatTextValue: value => value + 'ºC', fontSize: 10 },
                            ticks: [
                                { value: 13 },
                                { value: 23 },
                                { value: 32 }
                            ]
                        }
                    }}
                    value={liveDataGraph[0]?.value || 23}
                    minValue={10}
                    maxValue={40}
                />
            </div>
            <div>
                <h5>Risk of failure</h5>
                <GaugeComponent
                    type="semicircle"
                    arc={{
                        colorArray: ['#00FF15', '#FF2121'],
                        padding: 0.02,
                        subArcs: [
                            { limit: 15 },
                            { limit: 25 },
                            { limit: 60 },

                        ]
                    }}
                    pointer={{ type: "blob", animationDelay: 0 }}
                    value={(critAnomalyCount / 96) * 100}
                />
            </div>
            <div>
                <h5>Amount of warnings</h5>
                <GaugeComponent
                    type="semicircle"
                    arc={{
                        width: 0.2,
                        padding: 0.005,
                        cornerRadius: 1,
                        subArcs: [
                            { limit: 15, color: '#00FF15', showTick: true, tooltip: { text: 'ok amount of anomalies' }},
                            { limit: 30, color: 'yellow', showTick: true, tooltip: { text: 'warning amount of anomalies!' }},
                            { limit: 40, color: 'orange', showTick: true, tooltip: { text: 'high amount of anomalies!' }},
                            { color: '#EA4228', tooltip: { text: 'Too high amount of anomalies!' }}
                        ]
                    }}
                    pointer={{
                        color: '#345243',
                        length: 0.80,
                        width: 15
                    }}
                    labels={{
                        valueLabel: { formatTextValue: value => value + ' anomalies' },
                        tickLabels: {
                            type: 'outer',
                            valueConfig: { formatTextValue: value => value + 'ºC', fontSize: 10 },
                            ticks: [
                                { value: 15 },
                                { value: 30 },
                                { value: 40 }
                            ]
                        }
                    }}
                    value={anomalyCount}
                    minValue={0}
                    maxValue={70}
                />
            </div>
            <div>
                <h5>Amount of critical warnings</h5>
                <GaugeComponent
                    type="semicircle"
                    arc={{
                        width: 0.2,
                        padding: 0.005,
                        cornerRadius: 1,
                        subArcs: [
                            { limit: 5, color: '#00FF15', showTick: true, tooltip: { text: 'ok amount of anomalies' }},
                            { limit: 15, color: 'yellow', showTick: true, tooltip: { text: 'warning amount of anomalies!' }},
                            { limit: 30, color: 'orange', showTick: true, tooltip: { text: 'high amount of anomalies!' }},
                            { color: '#EA4228', tooltip: { text: 'Too high amount of anomalies!' }}
                        ]
                    }}
                    pointer={{
                        color: '#345243',
                        length: 0.80,
                        width: 15
                    }}
                    labels={{
                        valueLabel: { formatTextValue: value => value + ' anomalies' },
                        tickLabels: {
                            type: 'outer',
                            valueConfig: { formatTextValue: value => value + 'ºC', fontSize: 10 },
                            ticks: [
                                { value: 5 },
                                { value: 15 },
                                { value: 30 }
                            ]
                        }
                    }}
                    value={critAnomalyCount}
                    minValue={0}
                    maxValue={50}
                />
            </div>
        </div>
        </>
    );
};
