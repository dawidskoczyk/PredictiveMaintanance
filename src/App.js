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
import { Register } from './login/SignUp.js';  // Import SignIn component
import { AuthProvider, useAuth } from './login/AuthContext.js';  // Import SignIn component
import {ProtectedRoute } from './login/ProtectedRoute.js'; // Importuj ProtectedRoute

let dynamicData = [];
function App() {
  //const [fetched, setFetch] = useState(false);
  const [ranges, setRanges] = useState({ startDate: null, endDate: null });
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Stan ładowania
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state

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
        body: JSON.stringify({ startDate, endDate }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parsowanie odpowiedzi JSON
      console.log("Odpowiedź z serwera:", data.message);
      setDates(data.message);
      //window.location.reload();

      dynamicData = data.message;
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
    //const { Authenticated } = false;
  
    return (
      <div>
        {isAuthenticated ? (
          <>
            <DatePicker onChange={OnChange} />
            <BaseConnect />
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

const location = useLocation();
return (
    <AuthProvider>
      <Menu />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/history" element={<ProtectedRoute element={<History />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
);
}
function BaseConnect() {
  const defaultData = [1, 1, 1];
  const [data, setData] = useState(null);
  const thresholdUpC = 24;
  const thresholdMediumC = 22;
  const thresholdDownC = 20;
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
  // if (data ) {
  //   for (let i = 0; i <= 1; i++) {
  //     data[i] = data[i].sort(function (a, b) {
  //       return new Date(a.date) - new Date(b.date);
  //     });
  //   }
  // }

  return (
    <div>
      {data ? (
        <div>
          <h2 style={{ marginLeft: "4%" }}>Latest twelve data points</h2>
          <Table responsive>
            <thead>
              <tr>
                <th style={{ backgroundColor: "black", color: "white" }}>
                  Parameter
                </th>
                {Array.from({ length: 12 }).map((_, index) => (
                  <th key={index}>
                    {data[index]?.date
                      .replace("1900-", " ")
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
                      +data[index].value > thresholdUpC
                        ? { backgroundColor: "red"}
                        : +data[index].value > thresholdMediumC
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
              <h2 style={{ marginLeft: "4%" }}>Filtered data</h2>
              <tr>
                <th style={{ backgroundColor: "black", color: "white" }}>
                  Parameter
                </th>
                {Array.from({ length: 12 }).map((_, index) => (
                  <th key={index}>
                    {data[index]?.date
                      .replace("1900-", " ")
                      .replace("T", " ")
                      .replace("Z", " ").split('.')[0]}
                  </th>
                ))}
              </tr>
              <tr>
                <td style={{ backgroundColor: "grey", color: "white" }}>
                  Temperature (&#176;C)
                </td>
                {Array.from({ length: data.length }).map((_, index) => (
                  <td
                    key={index}
                    style={
                      +data[index].value > thresholdUpC
                        ? { backgroundColor: "red" }
                        : +data[index].value > thresholdMediumC
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
              {/* <tr>
              <td>3</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr> */}
            </tbody>
          </Table>
          <Chart initialData={data || []} />
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}
// to na dole nie działa
function ResponsiveExample() {
  // Only update state if `dynamic` has data and is different from `dynamicData`

  return <div></div>;
}

export default App;
