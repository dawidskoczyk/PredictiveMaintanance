import { GaugeComponent } from 'react-gauge-component';
import React, { useState, useEffect } from "react";

export const GraphanaCharts = ({ dynamicData = [], thresholds = [], liveData = [] }) => {
    const [data, setData] = useState(dynamicData);
    const [thresh, setThresh] = useState(thresholds);
    const [liveDataGraph, setLiveDataGraph] = useState(liveData);
    const [anomalyCount, setAnomalyCount] = useState(0);
    const [critAnomalyCount, setCritAnomalyCount] = useState(0);
    const [thresholdsUpdated, setThresholdsUpdated] = useState(false);

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

    return (
        <div style={{ display: 'flex',justifyContent: "center", margin: "0 auto", marginTop: "15%", marginBottom: "5%"}}>
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
                            { limit: 40 },
                            { limit: 60 },
                            { limit: 70 },
                            {},
                            {},
                            {},
                            {}
                        ]
                    }}
                    pointer={{ type: "blob", animationDelay: 0 }}
                    value={50}
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
    );
};
