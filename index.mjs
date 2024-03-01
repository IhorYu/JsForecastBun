import fs from "fs/promises";
import axios from "axios";
import { loadCities } from "./utils.mjs";

const getForecast = async (citiesArr, city) => {
  const cityObj = citiesArr.find((cityObj) => cityObj.name === city);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityObj.latitude}&longitude=${cityObj.longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
  const response = await axios.get(url);
  const result = response.data;
  return {
    date: new Date().toUTCString(),
    city,
    currentTemperature: result.current.temperature_2m,
    currentWindSpeed: result.current.wind_speed_10m,
    currentTimeZone: result.timezone,
    currentLatitude: cityObj.latitude,
    currentLongitude: cityObj.longitude,
  };
};

const getWeatherInCities = async (citiesArr) => {
  return await Promise.all(
    citiesArr.map((cityObj) => getForecast(citiesArr, cityObj.name))
  );
};

export const getForecastForCityIes = async (city) => {
  const citiesArr = await loadCities();
  if (city && !citiesArr.find((cityObj) => cityObj.name === city)) {
    throw new TypeError("The specified city is not supported");
  }
  try {
    const result = city
      ? await getForecast(citiesArr, city)
      : await getWeatherInCities(citiesArr);
    const data = JSON.stringify(result, null, 2);
    await fs.appendFile("./logs/" + Date.now() + ".txt", data + "\n");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

// setInterval(async () => await getForecastForCityIes(), 5000);
