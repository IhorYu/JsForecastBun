import express from "express";
import { getForecastForCityIes } from "../controllers/forecastController.mjs";
import { getDataFromLogs } from "../utils/fileUtils.mjs";

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const data = await getDataFromLogs();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:cityName", async (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  if (!cityName) {
    res.status(400).json({ error: "No city query parameter provided" });
  }
  try {
    const cityForecast = await getForecastForCityIes(cityName);
    res.status(200).json(cityForecast);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
