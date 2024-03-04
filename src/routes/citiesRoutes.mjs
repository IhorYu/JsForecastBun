import express from "express";
import { getAllCities, addCity } from "../controllers/citiesController.mjs";
const router = express.Router();

router.get("/", getAllCities);

router.post("/add", async (req, res) => {
  await addCity(req, res);
});

export default router;
