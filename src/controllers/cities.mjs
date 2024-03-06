import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { cityObjValidate } from "../utils/dataValidation.mjs";
import { CITIES_FILE_PATH, COUNTRIES_FILE_PATH } from "../../config.mjs";

export const getCity = async (req, res) => {
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const city = cities.find(
      (city) => city.name.toLowerCase() === req.params.cityName.toLowerCase()
    );
    if (city) {
      res.status(200).json(city);
    } else {
      res.status(404).json({ message: "City not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching city data" });
  }
};

export const addCity = async (req, res) => {
  if (
    !req.body.city ||
    !req.body.latitude ||
    !req.body.longitude ||
    !req.body.country
  ) {
    res.status(400).json({
      message: "Please provide city, latitude, longitude, and country",
    });
    return;
  }
  try {
    const countries = await getFileData(COUNTRIES_FILE_PATH);
    const isValidCountry = countries.some(
      (country) => country.name === req.body.country
    );
    if (!isValidCountry) {
      res
        .status(400)
        .send(
          `Country is not valid or not in the list of available countries. Supported countries: ${countries.map(
            (country) => country.name
          )}`
        );
      return;
    }
    const [city, cities] = await Promise.all([
      cityObjValidate.validate({
        name: req.body.city.toLowerCase(),
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        country: req.body.country,
      }),
      getFileData(CITIES_FILE_PATH),
    ]);
    cities.push(city);
    await writeFile(CITIES_FILE_PATH, cities);
    res.status(200).json({ message: "City added successfully" });
    return;
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(
        `Invalid data input. Allowed data: city [string] - ${req.body.city}, latitude [number] - ${req.body.latitude}, longitude [number] - ${req.body.longitude}, country [string] - ${req.body.country}`
      );
    return;
  }
};

export const getAllCities = async (_, res) => {
  try {
    const citiesArray = await getFileData(CITIES_FILE_PATH);
    const citiesObj = citiesArray.reduce((obj, city) => {
      obj[city.name] = { Latitude: city.latitude, Longitude: city.longitude };
      return obj;
    }, {});
    res.status(200).json(citiesObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCity = async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const country = req.body.country;
  const isFavorite = req.body.isFavorite;
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const cityIndex = cities.findIndex(
      (city) => city.name.toLowerCase() === cityName
    );
    if (cityIndex === -1) {
      return res.status(400).json({ message: "City not found" });
    }
    const updatedCity = {
      ...cities[cityIndex],
      latitude,
      longitude,
      country,
      isFavorite,
    };
    cities[cityIndex] = updatedCity;

    await writeFile(CITIES_FILE_PATH, cities);
    res.status(200).json({ message: `city ${cityName} updated` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating city" });
  }
};

export const deleteCity = async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();

  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const filteredCities = cities.filter(
      (city) => city.name.toLowerCase() !== cityName
    );
    if (cities.length === filteredCities.length) {
      return res.status(400).json({ message: "City not found" });
    }
    await writeFile(CITIES_FILE_PATH, filteredCities);
    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting city" });
  }
};
