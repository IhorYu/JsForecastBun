import { getForecastByCity } from "../services/forecast.mjs";
import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { CITIES_FILE_PATH, WEATHER_LOG_FILE_PATH } from "../../config.mjs";

const checkUpdate = async (city) => {
  const cityName = city.name.toLowerCase();
  const weatherLog = await getFileData(WEATHER_LOG_FILE_PATH);
  const cityWeather = weatherLog[cityName];
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  const needUpdate =
    !cityWeather || new Date(cityWeather.lastUpdate).getTime() < twoHoursAgo;

  if (needUpdate) {
    const forecast = await getForecastByCity(city);
    weatherLog[cityName] = {
      ...forecast,
    };
  }
  await writeFile(WEATHER_LOG_FILE_PATH, weatherLog);
};

export const getForecastForCity = async (req, res) => {
  try {
    const cityName = req.params.cityName.toLowerCase();
    const cities = await getFileData(CITIES_FILE_PATH);
    const city = cities.find((city) => city.name.toLowerCase() === cityName);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    checkUpdate(city);
    res.status(200).json((await getFileData(WEATHER_LOG_FILE_PATH))[cityName]);
  } catch (err) {
    console.error(error);
    res.status(400).json({ message: "Error getting forecast for city" });
    res
      .status(500)
      .json({ message: "Internal server error while fetching forecast" });
  }
};

export const getForecastForAllCities = async (_, res) => {
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    cities.forEach(async (city) => await checkUpdate(city));

    res.status(200).json(await getFileData(WEATHER_LOG_FILE_PATH));
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error getting forecast for all cities" });
    res
      .status(500)
      .json({ message: "Internal server error while fetching forecasts" });
  }
};
