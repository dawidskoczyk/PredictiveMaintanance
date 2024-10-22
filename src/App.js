import "./App.css";
import React from "react";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { addDays } from "date-fns";
import DatePicker from "./components/Filter.js";
import { Chart } from "./components/Chart.js";
import { Menu } from "./components/Menu.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { History } from "./components/AnomalyHistory/AnomalyHistory.js";
import { Login } from "./login/SignIn.js"; // Import SignIn component
import { AuthProvider, useAuth } from "./login/AuthContext.js"; // Import AuthContext
import { UserManagementPage } from "./userManagement/UserManagementPage.js";
import { ProtectedRoute } from "./login/ProtectedRoute.js"; // Import ProtectedRoute
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import { GraphanaCharts } from "./components/GraphanaCharts.js";
import { rgb } from "chroma-js";
import { toast } from "react-toastify";
import BackToTopButton from "./BackToTopButton.js";

let dynamicData = [];

function App() {
  const [ranges, setRanges] = useState({ startDate: null, endDate: null });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  function HomePage() {
    const { isAuthenticated } = useAuth();
    return (
      <div>
        {isAuthenticated ? (
          <>
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

  return (
    <AuthProvider>
      <Menu />
      <Routes>
        <Route
          path="/home"
          element={<ProtectedRoute element={<HomePage />} />}
        />
        <Route
          path="/user-management"
          element={<ProtectedRoute element={<UserManagementPage />} />}
        />
        <Route
          path="/history"
          element={<ProtectedRoute element={<History />} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

function BaseConnect() {
  const defaultData = [1, 1, 1];
  const [data, setData] = useState(null);
  const [dataAnomaly, setDataAnomaly] = useState([]);
  const [thresholds, setThresholds] = useState([28, 30]);
  const [isVisible, setIsVisible] = useState(true);
  const [dynamicPredictiveData, setDynamicPredictiveData] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);
  const [dates, setDates] = useState([]);

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
      .catch((err) => console.log(err));
  }, [data]);

  useEffect(() => {
    fetch("http://localhost:5001/api/dataPred", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDynamicPredictiveData(data.message);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (event) => {
    setIsVisible((current) => !current);
  };

  const handleSubmit = async (startDate, endDate) => {
    console.log(`handle submit start ${startDate} koniec ${endDate}`);
    try {
      const response = await fetch("http://localhost:5001/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Odpowiedź z serwera:", data.message);
      setDates(data.message);
      setDynamicData(data.message);
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  const OnChange = (newRanges) => {
    handleSubmit(newRanges.startDate, newRanges.endDate);
  };

  const handleThresh = (index, value) => {
    if (index === 1) {
      if (thresholds[0] >= value || value >= 40) return;
    }
    if (index === 0) {
      if (thresholds[1] <= value || value <= 23) return;
    }
    const newThresholds = [...thresholds];
    newThresholds[index] = value;
    setThresholds(newThresholds);
  };

  return (
    <div>
      {data ? (
        <div>
          <GraphanaCharts
            dynamicData={dynamicData || []}
            thresholds={thresholds || []}
            liveData={data || []}
            predictiveDataPar={dynamicPredictiveData || []}
          />
          {/* <h2 style={{ marginLeft: "4%", marginTop:'2%', fontSize:'28px', color:'red', textAlign:'center'}}>Latest twelve data points</h2> */}
          {/* <Table responsive style={{ width: "90%"}}>
            <thead>
              <tr>
                <th style={{ backgroundColor: "black", color: "white"}}>Date:</th>
                {Array.from({ length: 12 }).map((_, index) => (
                  <th key={index}>
                    {data[index]?.date
                      .replace("2024-", " ")
                      .replace("T", " ")
                      .replace("Z", " ")
                      .split('.')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: "120px", backgroundColor: "purple", color: "white" }}>Temperature (&#176;C)</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td
                    key={index}
                    style={
                      +data[index].value > thresholds[1]
                        ? { backgroundColor: "red" }
                        : +data[index].value > thresholds[0]
                        ? { backgroundColor: "orange" }
                        : +data[index].value > thresholdDownC
                        ? { backgroundColor: "lightgreen" }
                        : { backgroundColor: "cyan" }
                    }
                  >
                    {data[index].value}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table> */}

          <div className="thresholds-container">
            <div className="thresholds-form">
              {isVisible && (
                <>
                  <h2
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                      fontSize: "20px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Set Thresholds:
                  </h2>
                  <div className="threshold-inputs">
                    <label style={{ minWidth: "150px" }}>
                      Threshold warning
                    </label>
                    <input
                      type="number"
                      placeholder=""
                      name="warn"
                      value={thresholds[0]}
                      onChange={(e) => handleThresh(0, e.target.value)}
                      className="threshold-input"
                    />

                    <label style={{ minWidth: "150px" }}>
                      Threshold critical
                    </label>
                    <input
                      type="number"
                      name="crit"
                      value={thresholds[1]}
                      onChange={(e) => handleThresh(1, e.target.value)}
                      className="threshold-input"
                    />
                  </div>
                  <div className="reset-button">
                    {thresholds[0] !== 28 || thresholds[1] !== 30 ? (
                      <button
                        style={{
                          color: "black",
                          margin: "0",
                          padding: "0",
                          marginTop: "2%",
                          width: "240px",
                        }}
                        onClick={() => setThresholds([28, 30])}
                      >
                        Reset Thresholds to defaults
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <DatePicker onChange={OnChange} />
          {/* <h3 style={{ color: 'blue' }}>Press ctrl to move and zoom charts</h3> */}

          <div className="chart-container">
            <Chart
              initialData={dynamicData || []}
              thresholds={thresholds || []}
              predictiveDataPar={dynamicPredictiveData || []}
            />
          </div>
        </div>
      ) : (
        <p></p>
      )}
      <h2
        style={{
          marginLeft: "4%",
          marginTop: "5%",
          color: "blue",
          fontSize: "48px",
        }}
      >
        Filtered data
      </h2>
      <Table responsive>
        <thead>
          <tr>
            <th style={{ backgroundColor: "black", color: "white" }}>Date:</th>
            {Array.from({ length: 12 }).map((_, index) => (
              <th key={index}>
                {
                  dynamicData[index]?.date
                    .replace("2024-", " ")
                    .replace("T", " ")
                    .replace("Z", " ")
                    .split(".")[0]
                }
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
                  +dynamicData[index]?.value > thresholds[1]
                    ? { backgroundColor: "red" }
                    : +dynamicData[index]?.value > thresholds[0]
                    ? { backgroundColor: "orange" }
                    : +dynamicData[index]?.value > thresholdDownC
                    ? { backgroundColor: "lightgreen" }
                    : { backgroundColor: "cyan" }
                }
              >
                {dynamicData[index]?.value}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
      <BackToTopButton />
    </div>
  );
}

export default App;
