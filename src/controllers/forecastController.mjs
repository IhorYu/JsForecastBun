import { getForecastByCity } from "../services/forecast.mjs";
import { findCity } from "./citiesController.mjs";
import { appendFile, getFileData } from "../utils/fileHelper.mjs";
import { BASEDIR } from "../../config.mjs";
import fs from "fs/promises";

const getWeatherInCities = async (citiesArr) => {
  return await Promise.all(
    citiesArr.map((cityObj) => getForecastByCity(citiesArr, cityObj.name))
  );
};

export const getForecastForCityIes = async (city) => {
  const cityObj = await findCity(city);
  if (city && !cityObj) {
    throw new TypeError("The specified city is not supported");
  }
  try {
    const result = city
      ? await getForecastByCity(cityObj)
      : await getWeatherInCities(citiesArr);
    const data = JSON.stringify(result, null, 2);
    await appendFile(`${BASEDIR}/data/logs/` + Date.now() + ".txt", data);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

export const allCitiesForecast = async (req, res) => {
  try {
    const files = await fs.readdir(`${BASEDIR}/data/logs`);
    const data = {};

    for (const file of files) {
      const filePath = `${BASEDIR}/data/logs/${file}`;
      data[file] = await getFileData(filePath);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const forecastByCity = async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  if (!cityName) {
    res.status(400).json({ error: "No city query parameter provided" });
  }
  try {
    const cityForecast = await getForecastForCityIes(cityName);
    res.status(200).json(cityForecast);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
