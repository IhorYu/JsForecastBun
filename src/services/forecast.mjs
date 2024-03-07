import axios from "axios";
import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { WEATHER_LOG_FILE_PATH } from "../../config.mjs";
import { isExpirationValid } from "../utils/expirationCheck.mjs";

export const getForecastByCity = async (cityObj) => {
  const weatherLog = await getFileData(WEATHER_LOG_FILE_PATH);
  const cityWeather = weatherLog[cityObj.name];
  if (cityWeather && isExpirationValid(cityWeather.lastUpdate)) {
    return cityWeather;
  } else {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityObj.latitude}&longitude=${cityObj.longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    const response = await axios.get(url);
    const result = response.data;
    const forecast = {
      lastUpdate: new Date().toUTCString(),
      city: cityObj.name,
      currentTemperature: result.current.temperature_2m,
      currentWindSpeed: result.current.wind_speed_10m,
      currentTimeZone: result.timezone,
      currentLatitude: cityObj.latitude,
      currentLongitude: cityObj.longitude,
    };
    weatherLog[cityObj.name] = forecast;

    await writeFile(WEATHER_LOG_FILE_PATH, weatherLog);

    return forecast;
  }
};
