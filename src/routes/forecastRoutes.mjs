import express from "express";
import {
  forecastByCity,
  allCitiesForecast,
} from "../controllers/forecastController.mjs";

const router = express.Router();

router.get("/", async (_, res) => {
  await allCitiesForecast(_, res);
});

router.get("/:cityName", async (req, res) => {
  await forecastByCity(req, res);
});

export default router;
