import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { BASEDIR } from "../../config.mjs";
import { cityObjValidate } from "../utils/dataValidation.mjs";

const getCities = async () => {
  return await getFileData(`${BASEDIR}/data/cities.json`);
};

export const getCity = async (req, res) => {
  try {
    const cities = await getFileData(`${BASEDIR}/data/cities.json`);
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
    const countries = await getFileData(`${BASEDIR}/data/countries.json`);
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
      getFileData(`${BASEDIR}/data/cities.json`),
    ]);
    cities.push(city);
    await writeFile(`${BASEDIR}/data/cities.json`, cities);
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
    const citiesArray = await getCities();
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
