import express from "express";
import {
  getForecastForCity,
  getForecastForAllCities,
} from "../controllers/forecast.mjs";

const router = express.Router();

router.get("/", getForecastForAllCities);
router.get("/:cityName", getForecastForCity);

export default router;
