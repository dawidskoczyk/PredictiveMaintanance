const { reply, queryContainerDecybels } = require("./DatabaseApp.js");
const bp = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

let starterDate = null;
let enderDate = null;

app.get("/api", (req, res) => {
  return res.json({ message: reply });
});
const options = {
  day: "2-digit", // Dzień z zerem na początku
  month: "2-digit", // Miesiąc bez zera na początku
  year: "numeric", // Rok pełny
};
app.post("/api/data", async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);
  starterDate = startingDate?.toISOString();
  //console.log(startDate, endDate);
  enderDate = endingDate?.toISOString();
  //console.log("Received data:", data);
  exports.sd = starterDate;
  console.log(`api start ${starterDate}, ${enderDate}`);
  exports.ed = enderDate;
  const result = await queryContainerDecybels();
  console.log(`wynik${result}`);
  return res.json({ message: result });
});

app.listen(5001, () => {
  console.log("listening");
});
