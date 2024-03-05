import express from "express";
import forecastRoutes from "./routes/forecast.mjs";
import infoRoutes from "./routes/info.mjs";
import favoritesRoutes from "./routes/favorites.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import { PORT } from "../config.mjs";

// CONFIG
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/weather", forecastRoutes);
app.use("/info", infoRoutes);
app.use("/favorites", favoritesRoutes);
app.get("/", (_, res) => res.send("Alive\n"));

// MIDDLEWARE
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
