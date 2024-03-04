import express from "express";
import forecastRoutes from "./routes/forecast.mjs";
import infoRoutes from "./routes/info.mjs";
import { PORT } from "../config.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

// CONFIG
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/weather", forecastRoutes);
app.use("/info", infoRoutes);
app.get("/", (_, res) => res.send("Alive\n"));

// MIDDLEWARE
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
