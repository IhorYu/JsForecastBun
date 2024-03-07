import { getForecastByCity } from "../services/forecast.mjs";
import { getFileData } from "../utils/fileHelper.mjs";
import { CITIES_FILE_PATH } from "../../config.mjs";

export const getForecastForCity = async (req, res) => {
  try {
    const cityName = req.params.cityName.toLowerCase();
    const cities = await getFileData(CITIES_FILE_PATH);
    const city = cities.find((city) => city.name.toLowerCase() === cityName);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    const forecast = await getForecastByCity(city);
    res.status(200).json(forecast);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error getting forecast for city" });
    res
      .status(500)
      .json({ message: "Internal server error while fetching forecast" });
  }
};

export const getForecastForAllCities = async (_, res) => {
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const forecasts = [];
    for (const city of cities) {
      const forecast = await getForecastByCity(city);
      forecasts.push(forecast);
    }
    res.status(200).json(forecasts);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error getting forecast for all cities" });
    res
      .status(500)
      .json({ message: "Internal server error while fetching forecasts" });
  }
};
