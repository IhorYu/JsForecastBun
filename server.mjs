import express from "express";
import path from "path";
import {
  loadCities,
  getDataFromLogs,
  addCity,
  cityObjValidate,
} from "./utils.mjs";
import { getForecastForCityIes } from "./index.mjs";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Alive\n");
});

app.get("/cities", async (_, res) => {
  try {
    const citiesArray = await loadCities();
    const citiesObj = citiesArray.reduce((obj, city) => {
      obj[city.name] = { Latitude: city.latitude, Longitude: city.longitude };
      return obj;
    }, {});
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(citiesObj, null, 2));
    return;
  } catch (error) {
    res.status(500).send("Internal Server Error");
    return;
  }
});

app.get("/forecast", async (_, res) => {
  try {
    const data = await getDataFromLogs();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data), null, 2);
    return;
  } catch {
    res.status(500).send("Internal Server Error");
    return;
  }
});

app.get("/cityForecast/:cityName", async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  if (!cityName) {
    res.status(400).json({ error: "No city query parameter provided" });
    return;
  }
  try {
    const cityForecast = await getForecastForCityIes(cityName);
    res.status(200).json(cityForecast);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
    return;
  }
});

app.get("/addCity", (_, res) => {
  res.sendFile(path.join(__dirname, "templates/add_city.html"));
  return;
});

app.post("/city", async (req, res) => {
  if (!req.body.city || !req.body.latitude || !req.body.longitude) {
    res.status(400).send("Please provide city, latitude, and longitude");
    return;
  }
  try {
    const city = cityObjValidate.cast({
      name: req.body.city.toLowerCase(),
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });
    await addCity(city);
    res.status(200).send("City added successfully");
    return;
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(
        `Invalid data input. Allowed data: city [string] - ${req.body.city}, latitude [number] - ${req.body.latitude}, longitude [number] - ${req.body.longitude}`
      );
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
