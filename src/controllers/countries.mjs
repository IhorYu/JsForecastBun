import { getFileData, writeFile } from "../utils/fileHelper.mjs";
import { BASEDIR } from "../../config.mjs";

export const getCountries = async (_, res) => {
  try {
    const countries = await getFileData(`${BASEDIR}/data/countries.json`);
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries data" });
  }
};

export const getCitiesInCountry = async (req, res) => {
  try {
    const cities = await getFileData(`${BASEDIR}/data/cities.json`);
    const countryName = req.params.countryName.toLowerCase();
    const countryCities = cities.filter(
      (city) => city.country.toLowerCase() === countryName
    );
    if (countryCities.length > 0) {
      res.json(countryCities);
    } else {
      res.status(404).json({ message: "No cities found for this country" });
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
    const countriesPath = `${BASEDIR}/data/countries.json`;
    const countriesData = await getFileData(countriesPath);
    if (
      countriesData.some(
        (country) => country.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return res.status(409).json({ message: "Country already exists." });
    }
    const newCountry = { name, flag };
    countriesData.push(newCountry);

    await writeFile(
      countriesPath,
      JSON.stringify(countriesData, null, 2),
      "utf8"
    );

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
