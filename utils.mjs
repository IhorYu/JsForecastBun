import fs from "fs/promises";

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

export const addCity = async (city, latitude, longitude) => {
  const cityObj = {
    name: city.toLowerCase(),
    latitude: +latitude,
    longitude: +longitude,
  };
  const data = await fs.readFile("./cities.json", "utf8");
  const cities = JSON.parse(data);
  cities.push(cityObj);
  const json = JSON.stringify(cities, null, 2);
  await fs.writeFile("./cities.json", json);
};

export const getParsedUrl = async (req) => {
  return new URL(req.url, `http://${req.headers.host}`);
};
