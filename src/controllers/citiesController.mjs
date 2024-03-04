import { getFileData } from "../utils/fileHelper.mjs";
import fs from "fs/promises";
import { BASEDIR } from "../../config.mjs";
import { cityObjValidate } from "../utils/dataValidation.mjs";

export const getCities = async () => {
  return await getFileData("./data/cities.json");
};

export const addCity = async (req, res) => {
  if (!req.body.city || !req.body.latitude || !req.body.longitude) {
    res.status(400).send("Please provide city, latitude, and longitude");
    return;
  }
  try {
    const city = await cityObjValidate.validate({
      name: req.body.city.toLowerCase(),
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });
    const data = await getFileData("./data/cities.json");
    const cities = JSON.parse(data);
    cities.push(city);
    const json = JSON.stringify(cities, null, 2);
    await fs.writeFile(`${BASEDIR}/data/cities.json`, json);
    res.status(200).send("City added successfully");
    return;
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(
        `Invalid data input. Allowed data: city [string] - ${req.body.city}, latitude [number] - ${req.body.latitude}, longitude [number] - ${req.body.longitude}`
      );
    return;
  }
};

export const findCity = async (city) => {
  const citiesArr = await getCities();
  return citiesArr.find((cityObj) => cityObj.name === city);
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
    res.status(500).send("Internal Server Error");
  }
};
