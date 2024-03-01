import express from "express";
import {
  loadCities,
  getDataFromLogs,
  addCity,
  getParsedUrl,
} from "./utils.mjs";
import { getForecastForCityIes } from "./index.mjs";

const app = express();

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
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/forecast", async (_, res) => {
  try {
    const data = await getDataFromLogs();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data), null, 2);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// TODO: .get('/cityForecast/:cityName', (...) => {...})
app.get("/cityForecast", async (req, res) => {
  try {
    const parsedUrl = await getParsedUrl(req);
    const cityName = parsedUrl.searchParams.get("city");
    if (cityName) {
      const cityForecast = await getForecastForCityIes(cityName);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(cityForecast);
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No city query parameter provided" }));
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// TODO: move to post request (data would comes from body)
app.get("/addCity", async (req, res) => {
  try {
    const parsedUrl = await getParsedUrl(req);
    const latitude = parsedUrl.searchParams.get("latitude");
    const longitude = parsedUrl.searchParams.get("longitude");
    const city = parsedUrl.searchParams.get("city");
    if (isNaN(+latitude) || isNaN(+longitude)) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Latitude and longitude must be numbers");
    }
    if (city && latitude && longitude) {
      await addCity(city, latitude, longitude);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("City added successfully");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// TODO:  update to use variable
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000"); // TODO: here as well
});
