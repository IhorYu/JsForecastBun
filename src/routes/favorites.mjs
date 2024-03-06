import express from "express";
import {
  toggleCityFavorite,
  getFavorites,
  getFavoriteCity,
  getFavoritesByCountry,
} from "../controllers/favorites.mjs";

const router = express.Router();

router.get("/", getFavorites);
router.put("/:cityName", toggleCityFavorite);
router.get("/:cityName", getFavoriteCity);
router.get("/country/:countryName", getFavoritesByCountry);

export default router;
