import express from "express";
import {
  getAllCities,
  getCity,
  addCity,
  updateCity,
  deleteCity,
} from "../controllers/cities.mjs";
import {
  getCountries,
  getCitiesInCountry,
  addCountry,
  updateCountry,
  deleteCountry,
} from "../controllers/countries.mjs";

const router = express.Router();

const citiesRouter = express.Router();
citiesRouter.get("/", getAllCities);
citiesRouter.get("/:cityName", getCity);
citiesRouter.post("/", addCity);
citiesRouter.put("/:cityName", updateCity);
citiesRouter.delete("/:cityName", deleteCity);

const countriesRouter = express.Router();
countriesRouter.get("/", getCountries);
countriesRouter.get("/:countryName/cities", getCitiesInCountry);
countriesRouter.get("/:countryName/cities/:cityName", getCity);
countriesRouter.post("/", addCountry);
countriesRouter.put("/:countryName", updateCountry);
countriesRouter.delete("/:countryName", deleteCountry);

router.use("/cities", citiesRouter);
router.use("/countries", countriesRouter);

export default router;
