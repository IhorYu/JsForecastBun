import { readFileAsync } from "../utils/fileUtils.mjs";
import fs from "fs/promises";
import { BASEDIR } from "../../config.mjs";

export const loadCities = async () => {
  return await readFileAsync("./data/cities.json");
};

export const addCity = async (city) => {
  const data = await readFileAsync("./data/cities.json");
  const cities = JSON.parse(data);
  cities.push(city);
  const json = JSON.stringify(cities, null, 2);
  await fs.writeFile(`${BASEDIR}/data/cities.json`, json);
};
