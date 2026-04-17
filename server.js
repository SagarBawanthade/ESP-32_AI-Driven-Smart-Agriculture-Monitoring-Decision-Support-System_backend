import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

let latestData = {}; // store latest data

// POST API (ESP32 sends data here)
app.post("/sensor-data", (req, res) => {
  const data = req.body;

  console.log("Received:", data);


  let status = "";
  let recommendation = "";

  if (data.moisture < 30 && data.temperature > 35) {
    status = "High Risk";
    recommendation = "Immediate irrigation required";
  } 
  else if (data.moisture < 30) {
    status = "Dry";
    recommendation = "Turn ON irrigation";
  } 
  else if (data.moisture > 70) {
    status = "Overwatered";
    recommendation = "Stop irrigation";
  } 
  else {
    status = "Optimal";
    recommendation = "No action needed";
  }

  latestData = {
    ...data,
    status,
    recommendation,
    time: new Date()
  };

  res.json({ message: "Data received", latestData });
});

// GET API (dashboard will use this)

// GET API (dashboard will use this)
app.get("/", (req, res) => {
  res.json("Welcome to the Smart Irrigation System API");
});


app.get("/data", (req, res) => {
  res.json(latestData);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});