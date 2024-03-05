import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { CITIES_FILE_PATH, COUNTRIES_FILE_PATH } from "../../config.mjs";

export const getCountries = async (_, res) => {
  try {
    const countries = await getFileData(COUNTRIES_FILE_PATH);
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries data" });
  }
};

export const getCitiesInCountry = async (req, res) => {
  try {
    const cities = await getFileData(CITIES_FILE_PATH);
    const countryName = req.params.countryName.toLowerCase();
    const countryCities = cities.filter(
      (city) => city.country.toLowerCase() === countryName
    );
    if (countryCities.length > 0) {
      res.json(countryCities);
    } else {
      res.status(404).json({ message: `No cities found for ${countryName}` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities for country" });
  }
};

export const addCountry = async (req, res) => {
  const name = req.body.name;
  const flag = req.body.flag;

  if (!name || !flag) {
    return res
      .status(400)
      .json({ message: "Please provide both name and flag of the country." });
  }

  try {
    const countriesData = await getFileData(COUNTRIES_FILE_PATH);
    if (
      countriesData.some(
        (country) => country.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return res.status(400).json({ message: "Country already exists." });
    }
    countriesData.push({ name, flag });

    await writeFile(COUNTRIES_FILE_PATH, countriesData);

    res
      .status(201)
      .json({ message: "Country added successfully.", country: newCountry });
  } catch (error) {
    console.error("Error adding country:", error);
    res
      .status(500)
      .json({ message: "Internal server error while adding new country." });
  }
};

export const updateCountry = async (req, res) => {
  const countryName = req.params.countryName;
  const flag = req.body.flag;
  try {
    const countries = await getFileData(COUNTRIES_FILE_PATH);
    const countryIndex = countries.findIndex(
      (country) => country.name.toLowerCase() === countryName.toLowerCase()
    );
    if (countryIndex === -1) {
      return res.status(400).json({ message: "Country not found" });
    }
    countries[countryIndex].flag = flag;
    await writeFile(COUNTRIES_FILE_PATH, countries);
    res.status(200).json({ message: "Country updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating country" });
  }
};

export const deleteCountry = async (req, res) => {
  const countryName = req.params.countryName;
  try {
    const countries = await getFileData(COUNTRIES_FILE_PATH);
    const cities = await getFileData(CITIES_FILE_PATH);

    const filteredCountries = countries.filter(
      (country) => country.name.toLowerCase() !== countryName.toLowerCase()
    );
    const filteredCities = cities.filter(
      (city) => city.country.toLowerCase() !== countryName.toLowerCase()
    );
    if (countries.length === filteredCountries.length) {
      return res.status(400).json({ message: "Country not found" });
    }

    await writeFile(COUNTRIES_FILE_PATH, filteredCountries);
    await writeFile(CITIES_FILE_PATH, filteredCities);
    res
      .status(200)
      .json({ message: "Country and its cities deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting country" });
  }
};
