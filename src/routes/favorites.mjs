import express from "express";
import {
  addCityToFavorites,
  deleteCityFromFavorites,
  getFavorites,
  getFavoriteCity,
  getFavoritesByCountry,
} from "../controllers/favorites.mjs";

const router = express.Router();

router.get("/", getFavorites);
router.put("/add/:cityName", addCityToFavorites);
router.delete("/delete/:cityName", deleteCityFromFavorites);
router.get("/:cityName", getFavoriteCity);
router.get("/country/:countryName", getFavoritesByCountry);

export default router;
