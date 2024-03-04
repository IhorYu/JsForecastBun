import express from "express";
import { getAllCities, addCity } from "../controllers/citiesController.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
  await getAllCities(req, res);
});

router.post("/add", async (req, res) => {
  await addCity(req, res);
});

export default router;
