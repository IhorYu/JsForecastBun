import fs from "fs/promises";
import { object, string, number } from "yup";

export const loadCities = async () => {
  try {
    const data = await fs.readFile("./cities.json", "utf8");
    const citiesArr = JSON.parse(data);
    return citiesArr;
  } catch (error) {
    console.error("Reading file error:", error);
  }
};

export const getDataFromLogs = async () => {
  try {
    const files = await fs.readdir("logs");
    const dataPromises = files.map((file) =>
      fs.readFile(`logs/${file}`, "utf8")
    );
    const filesData = await Promise.all(dataPromises);
    const dataObj = files.reduce((acc, file, index) => {
      acc[file] = JSON.parse(filesData[index]);
      return acc;
    }, {});
    return dataObj;
  } catch (error) {
    console.error("Reading log file error:", error);
    return {};
  }
};

export const addCity = async (city) => {
  const data = await fs.readFile("./cities.json", "utf8");
  const cities = JSON.parse(data);
  cities.push(city);
  const json = JSON.stringify(cities, null, 2);
  await fs.writeFile("./cities.json", json);
};

export let cityObjValidate = object({
  longitude: number().required().positive(),
  latitude: number().required().positive(),
  name: string().required(),
});
