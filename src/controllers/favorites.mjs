import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { CITIES_FILE_PATH } from "../../config.mjs";

export const addCityToFavorites = async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const cityIndex = cities.findIndex(
      (city) => city.name.toLowerCase() === cityName
    );
    if (cityIndex === -1) {
      return res.status(400).json({ message: "City not found" });
    }
    cities[cityIndex].isFavorite = true;
    await writeFile(CITIES_FILE_PATH, cities);
    res
      .status(200)
      .json({ message: `City ${cityName} added to favorites successfully` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding city to favorites" });
  }
};

export const deleteCityFromFavorites = async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();

  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const cityIndex = cities.findIndex(
      (city) => city.name.toLowerCase() === cityName
    );

    if (cityIndex === -1) {
      return res.status(400).json({ message: "City not found" });
    }
    cities[cityIndex].isFavorite = false;

    await writeFile(CITIES_FILE_PATH, cities);
    res.status(200).json({
      message: `City ${cityName} removed from favorites successfully`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting city to favorites" });
  }
};

export const getFavorites = async (_, res) => {
  try {
    const citiesData = await getFileData(CITIES_FILE_PATH);
    const favorites = citiesData.filter((city) => city.isFavorite);
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Error getting favorite" });
  }
};

export const getFavoriteCity = async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const city = cities.find(
      (city) => city.name.toLowerCase() === cityName && city.isFavorite
    );
    if (city) {
      res.status(200).json(city);
    } else {
      res.status(400).json({ message: "Favorite city not found" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Error getting favorite city ${cityName}` });
  }
};

export const getFavoritesByCountry = async (req, res) => {
  const countryName = req.params.countryName.toLowerCase();
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const favorites = cities.filter(
      (city) => city.country.toLowerCase() === countryName && city.isFavorite
    );
    res.status(200).json(favorites);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error getting favorite cities for ${countryName}` });
  }
};
