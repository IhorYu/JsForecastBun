import express from "express";
import citiesRoutes from "./routes/citiesRoutes.mjs";
import forecastRoutes from "./routes/forecastRoutes.mjs";
import { PORT } from "../config.mjs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/forecast", forecastRoutes);
app.use("/cities", citiesRoutes);

app.get("/", (_, res) => res.send("Alive\n"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
