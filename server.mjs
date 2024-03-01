import express from "express";
import path from "path";
import {
  loadCities,
  getDataFromLogs,
  addCity,
  // getParsedUrl,
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

// TODO: .get('/cityForecast/:cityName', (...) => {...})     (query parameter > route parameter)
app.get("/cityForecast/:cityName", async (req, res) => {
  try {
    const cityName = req.params.cityName.toLowerCase();
    if (cityName) {
      const cityForecast = await getForecastForCityIes(cityName);
      res.status(200).json(cityForecast);
    } else {
      res.status(400).json({ error: "No city query parameter provided" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/addCity", (req, res) => {
  res.sendFile(path.join(__dirname, "templates/add_city.html"));
});
// TODO: move to post request (data would comes from body)
app.post("/postAddCity", async (req, res) => {
  try {
    const city = req.body.city;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    if (isNaN(+latitude) || isNaN(+longitude) || !isNaN(city)) {
      res
        .status(400)
        .send("City must be string ,latitude and longitude must be numbers");
    } else if (city && latitude && longitude) {
      await addCity(city, latitude, longitude);
      res.status(200).send("City added successfully");
    } else {
      res.status(400).send("Please provide city, latitude, and longitude");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// TODO:  update to use variable
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // TODO: here as well
});
