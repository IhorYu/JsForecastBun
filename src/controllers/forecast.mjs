import { getForecastByCity } from "../services/forecast.mjs";
import { getFileData } from "../utils/fileHelper.mjs";
import { CITIES_FILE_PATH } from "../../config.mjs";

export const getForecastForCity = async (req, res) => {
  try {
    const cityName = req.params.cityName.toLowerCase();
    const citiesData = await getFileData(CITIES_FILE_PATH);
    const city = citiesData.find(
      (city) => city.name.toLowerCase() === cityName
    );

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const forecast = await getForecastByCity(city);
    res.status(200).json(forecast);
  } catch (error) {
    console.error("Error getting forecast for city:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching forecast" });
  }
};

export const getForecastForAllCities = async (_, res) => {
  try {
    const citiesData = await getFileData("./data/cities.json");

    const forecasts = await Promise.all(
      citiesData.map((city) => getForecastByCity(city))
    );
    res.status(200).json(forecasts);
  } catch (error) {
    console.error("Error getting forecasts for all cities:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching forecasts" });
  }
};
