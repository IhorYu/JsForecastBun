import { getForecastFromAPI } from "../api/forecastAPI.mjs";
import { loadCities } from "./citiesController.mjs";
import { appendFileAsync } from "../utils/fileUtils.mjs";
import { BASEDIR } from "../../config.mjs";

const getWeatherInCities = async (citiesArr) => {
  return await Promise.all(
    citiesArr.map((cityObj) => getForecastFromAPI(citiesArr, cityObj.name))
  );
};

export const getForecastForCityIes = async (city) => {
  const citiesArr = await loadCities();
  if (city && !citiesArr.find((cityObj) => cityObj.name === city)) {
    throw new TypeError("The specified city is not supported");
  }
  try {
    const result = city
      ? await getForecastFromAPI(citiesArr, city)
      : await getWeatherInCities(citiesArr);
    const data = JSON.stringify(result, null, 2);
    await appendFileAsync(`${BASEDIR}/data/logs/` + Date.now() + ".txt", data);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};
