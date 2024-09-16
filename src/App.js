import "./App.css";
import React from 'react';
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { addDays } from "date-fns";
//import BaseConnect from "./components/BaseConnect";
import DatePicker from "./components/Filter.js";
import { Chart } from "./components/Chart.js";
import {Menu} from "./components/Menu.js";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { History } from "./components/AnomalyHistory/AnomalyHistory.js";
import { Login } from './login/SignIn.js';  // Import SignIn component
import { AuthProvider, useAuth } from './login/AuthContext.js';  // Import SignIn component
import { UserManagementPage } from "./userManagement/UserManagementPage.js";
import {ProtectedRoute } from './login/ProtectedRoute.js'; // Importuj ProtectedRoute
import { ToastContainer } from 'react-toastify';  // Importuj ToastContainer
import { GraphanaCharts } from "./components/GraphanaCharts.js";
let dynamicData = [];

function App() {
  //const [fetched, setFetch] = useState(false);
  const [ranges, setRanges] = useState({ startDate: null, endDate: null });
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Stan ładowania
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const [dynamicData, setDynamicData] = useState([]);
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  // Funkcja obsługująca wysłanie danych do serwera
  const handleSubmit = async (startDate, endDate) => {
    // Wysyłanie danych do serwera Express
    console.log(` handle submit start ${startDate} koniec ${endDate}`);
    try {
      const response = await fetch("http://localhost:5001/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parsowanie odpowiedzi JSON
      console.log("Odpowiedź z serwera:", data.message);
      setDates(data.message);
      setDynamicData(data.message);
      //setDynamicPredictiveData()
      //window.location.reload();
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  // Funkcja obsługująca zmianę zakresu
  const OnChange = (newRanges) => {
    // console.log(newRanges.startDate.toLocaleDateString());

    //setRanges(newRanges);
    //console.log(`klikanko${ranges.startDate}, ${ranges.endDate}`);
    // Wywołanie handleSubmit po zaktualizowaniu zakresów
    handleSubmit(newRanges.startDate, newRanges.endDate);
  };

  // useEffect(() => {
  //   if (fetched && ranges.startDate && ranges.endDate) {
  //     fetch("http://localhost:5001/api")
  //       .then((res) => res.json())
  //       .then((data) => setDates(data.message))
  //       .then(() => setFetch(false))
  //       .catch((err) => console.log(err));
  //   }
  // }, [dates, fetched, ranges.endDate, ranges.startDate]);
  function HomePage() {
    const { isAuthenticated } = useAuth();
    return (
      <div>
        {isAuthenticated ? (
          <>
            <DatePicker onChange={OnChange} />
            <BaseConnect dynamicData={dynamicData} />
          </>
        ) : (
          <div className="home-page">
            <h2>Welcome to the App</h2>
            <p>Please log in to access the main features.</p>
          </div>
        )}
      </div>
    );
  }
return (
    <AuthProvider>
      <Menu />
      <Routes>
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />}  />
        <Route path="/user-management" element={<UserManagementPage />} /> 
        <Route path="/history" element={<ProtectedRoute element={<History />} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
    </AuthProvider>
);
}
function  BaseConnect({ dynamicData }) {
  const defaultData = [1, 1, 1];
  const [data, setData] = useState(null);
  const [dataAnomaly, setDataAnomaly] = useState([]);
  const [thresholds, setThresholds] = useState([28,30]);
  const [isVisible, setIsVisible] = useState(true);
  const [dynamicPredictiveData, setDynamicPredictiveData] = useState([]);
  // useState(() => {
  //   const saved = window.localStorage.getItem('isVisible');
  //   return saved !== null ? JSON.parse(saved) : false;
  // });
  const thresholdUpC = 33;
  const thresholdMediumC = 30;
  const thresholdDownC = 23;
  const thresholdUpdB = 75;
  const thresholdMediumdB = 65;
  const thresholdDowndB = 35;

  useEffect(() => {
    fetch("http://localhost:5001/api")
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, [data]);

  useEffect(() => {
    fetch("http://localhost:5001/api/dataPred", {
      method: 'POST', // Change to POST request
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
      },
      body: JSON.stringify({ /* Add any data you want to send in the request body */ }),
    })
    .then((res) => res.json())
    .then((data) => {
      setDynamicPredictiveData(data.message); // Update state with the response
      console.log(data); // Log the data for debugging
    })
    .catch((err) => console.error(err)); // Handle any errors
  }, []); // Empty dependency array to run once on mount
  
  console.log(dynamicData ? dynamicData : "ni ma danych");

  const handleChange = event => {
  
    setIsVisible(current => !current);
  };
  const handleThresh = (index, value) => {
    if(index===1){
      if(thresholds[0]>=value) return;
    }
    if(index===0){
      if(thresholds[1]<=value) return;
    }
    const newThresholds = [...thresholds];
    newThresholds[index] = value;
    setThresholds(newThresholds);
  }

  return (
    <div>
      {data ? (
        <div>
          <h2 style={{ marginLeft: "4%", marginTop:'2%', fontSize:'48px', color:'red'}}>Latest twelve data points</h2>
          <Table responsive>
            <thead>
              <tr>
                <th style={{ backgroundColor: "black", color: "white" }}>
                  Parameter
                </th>
                {Array.from({ length: 12 }).map((_, index) => (
                  <th key={index}>
                    {data[index]?.date
                      .replace("2024-", " ")
                      .replace("T", " ")
                      .replace("Z", " ").split('.')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "120px",
                    backgroundColor: "purple",
                    color: "white",
                  }}
                >
                  Temperature (&#176;C)
                </td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td
                    key={index}
                    style={
                      +data[index].value > thresholds[1]
                        ? { backgroundColor: "red"}
                        : +data[index].value > thresholds[0]
                        ? { backgroundColor: "orange" }
                        : +data[index].value > thresholdDownC
                        ? { backgroundColor: "lightgreen" }
                        : { backgroundColor: "cyan" }
                    }
                  >
                    {data[index].value}{" "}
                  </td>
                ))}
              </tr>
              </tbody>
              </Table>
              
          
          <div className="thresholds-container">
      <div className="thresholds-form">
        <h2>
          Pick your own Thresholds
          <input
            type='checkbox'
            name='thresh'
            value={isVisible}
            onChange={handleChange}
            style={{ marginLeft: '2%' }}
          />
        </h2>
        {isVisible && (
          <>
            <div className="threshold-inputs">
              <label>Threshold warning</label>
              <input
                type="number"
                placeholder=""
                name='warn'
                value={thresholds[0]}
                onChange={(e) => handleThresh(0, e.target.value)}
                className="threshold-input"
              />
              <br />
              <label>Threshold critical</label>
              <input
                type="number"
                name='crit'
                value={thresholds[1]}
                onChange={(e) => handleThresh(1, e.target.value)}
                className="threshold-input"
              />
            </div>
            <div className="reset-button">
              {thresholds[0] !== 28 || thresholds[1] !== 30 ? (
                <button
                  style={{ color: 'black', marginTop: '2%' }}
                  onClick={() => setThresholds([28, 30])}
                >
                  Reset Thresholds to defaults
                </button>
              ) : ''}
            </div>
          </>
        )}
      </div>
      <h3 style={{color:'blue'}}>Press ctrl to move and zoom charts</h3>
      <GraphanaCharts/>
      <div className="chart-container">
        <Chart initialData={dynamicData || []} thresholds={thresholds || []} predictiveDataPar={dynamicPredictiveData|| []} />
      </div>
    </div>
        </div>
      ) : (
        <p></p>
      )}
      <h2 style={{ marginLeft: "4%", marginTop:"5%", color:"blue", fontSize:"48px" }}>Filtered data</h2>
              <Table responsive>
              <thead>
              <tr>
                <th style={{ backgroundColor: "black", color: "white" }}>
                  Parameter
                </th>
                {Array.from({  length: dynamicData.length }).map((_, index) => (
                  <th key={index}>
                    {dynamicData[index]?.date
                      .replace("2024-", " ")
                      .replace("T", " ")
                      .replace("Z", " ")}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody>
              <tr>
                <td style={{ backgroundColor: "grey", color: "white", width:'150px' }}>
                  Temperature (&#176;C)
                </td>
                {dynamicData ? Array.from({ length: dynamicData.length }).map((_, index) => (
                  <td
                    key={index}
                    style={
                      +dynamicData[index].value > thresholds[1]
                        ? { backgroundColor: "red" }
                        : +dynamicData[index].value > thresholds[0]
                        ? { backgroundColor: "orange" }
                        : +dynamicData[index].value > thresholdDownC
                        ? { backgroundColor: "lightgreen" }
                        : { backgroundColor: "cyan" }
                    }
                  >
                    {dynamicData[index].value}{" "}
                  </td>
                )):<p></p>}
              </tr>
              {/* <tr>
              <td>3</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr> */}
            </tbody>
          </Table>
    </div>
    
  )
}
// to na dole nie działa
function ResponsiveExample() {
  // Only update state if `dynamic` has data and is different from `dynamicData`

  return <div></div>
}

export default App;
