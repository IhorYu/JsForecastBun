import path from "path";
import { fileURLToPath } from "url";

// PATHS
const __filename = fileURLToPath(import.meta.url);
export const BASEDIR = path.dirname(__filename);
export const PORT = process.env.PORT || 3000;
export const CITIES_FILE_PATH = `${BASEDIR}/data/cities.json`;
export const COUNTRIES_FILE_PATH = `${BASEDIR}/data/countries.json`;
export const WEATHER_LOG_FILE_PATH = `${BASEDIR}/data/logs/weatherLog.json`;

// UTILS
export const EXPIRATION_IN_MS = 2 * 60 * 60 * 1000;
