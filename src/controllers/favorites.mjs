import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { CITIES_FILE_PATH } from "../../config.mjs";

export const toggleCityFavorite = async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  const addToFavorites = req.body.addToFavorites;
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const cityIndex = cities.findIndex(
      (city) => city.name.toLowerCase() === cityName
    );

    if (cityIndex === -1) {
      return res.status(400).json({ message: "City not found" });
    }

    if (addToFavorites === "true") {
      cities[cityIndex].isFavorite = true;
      res
        .status(200)
        .json({ message: `City ${cityName} added to favorites successfully` });
    } else {
      const { isFavorite, ...updatedCity } = cities[cityIndex];
      cities.splice(cityIndex, 1, updatedCity);
      res.status(200).json({
        message: `City ${cityName} removed from favorites successfully`,
      });
    }

    await writeFile(CITIES_FILE_PATH, cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating city favorite status" });
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
