import express from "express";
import { loadCities, addCity } from "../controllers/citiesController.mjs";
import { cityObjValidate } from "../utils/validationUtils.mjs";
const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const citiesArray = await loadCities();
    const citiesObj = citiesArray.reduce((obj, city) => {
      obj[city.name] = { Latitude: city.latitude, Longitude: city.longitude };
      return obj;
    }, {});
    res.status(200).json(citiesObj);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
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
    await addCity(city);
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
});

export default router;
