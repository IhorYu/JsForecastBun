import axios from "axios";

export const getForecastByCity = async (cityObj) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityObj.latitude}&longitude=${cityObj.longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
  const response = await axios.get(url);
  const result = response.data;
  return {
    lastUpdate: new Date().toUTCString(),
    city: cityObj.name,
    currentTemperature: result.current.temperature_2m,
    currentWindSpeed: result.current.wind_speed_10m,
    currentTimeZone: result.timezone,
    currentLatitude: cityObj.latitude,
    currentLongitude: cityObj.longitude,
  };
};
