import express from "express";
import { getAllCities, getCity, addCity } from "../controllers/cities.mjs";
import {
  getCountries,
  getCitiesInCountry,
  addCountry,
} from "../controllers/countries.mjs";

const router = express.Router();

const citiesRouter = express.Router();
citiesRouter.get("/", getAllCities);
citiesRouter.get("/:cityName", getCity);
citiesRouter.post("/", addCity);

const countriesRouter = express.Router();
countriesRouter.get("/", getCountries);
countriesRouter.get("/:countryName/cities", getCitiesInCountry);
countriesRouter.get("/:countryName/cities/:cityName", getCity);
countriesRouter.post("/", addCountry);

router.use("/cities", citiesRouter);
router.use("/countries", countriesRouter);

export default router;
