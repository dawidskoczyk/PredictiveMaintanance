import "./App.css";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { addDays } from "date-fns";
//import BaseConnect from "./components/BaseConnect";
import DatePicker from "./components/Filter.js";
import { Chart } from "./components/Chart.js";
let dynamicData = [];
function App() {
  //const [fetched, setFetch] = useState(false);
  const [ranges, setRanges] = useState({ startDate: null, endDate: null });
  const [dates, setDates] = useState([]);

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

  return (
    <div>
      <DatePicker onChange={OnChange} />
      <BaseConnect />

      <ResponsiveExample />
    </div>
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
      .catch((err) => console.log(err));
  }, [data]);

  return (
    <div>
      <h1 style={{ color: "blue", marginLeft: 50 }}>
        {data ? "Testing data from sensors" : "loading..."}
      </h1>
      {data ? (
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th style={{ backgroundColor: "black", color: "white" }}>
                  Parameter
                </th>
                {Array.from({ length: 12 }).map((_, index) => (
                  <th key={index}>{data[0][index].time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "150px",
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
                      +data[0][index].amount > thresholdUpC
                        ? { backgroundColor: "red" }
                        : +data[0][index].amount > thresholdMediumC
                        ? { backgroundColor: "orange" }
                        : +data[0][index].amount > thresholdDownC
                        ? { backgroundColor: "green" }
                        : { backgroundColor: "cyan" }
                    }
                  >
                    {data[0][index].amount}{" "}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ backgroundColor: "grey", color: "white" }}>
                  Volume (dB)
                </td>
                {Array.from({ length: data[1].length }).map((_, index) => (
                  <td
                    key={index}
                    style={
                      +data[1][index].amount > thresholdUpdB
                        ? { backgroundColor: "red" }
                        : +data[1][index].amount < thresholdMediumdB
                        ? { backgroundColor: "green" }
                        : { backgroundColor: "orange" }
                    }
                  >
                    {data[1][index].amount}{" "}
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
