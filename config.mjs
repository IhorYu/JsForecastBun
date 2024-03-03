import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const BASEDIR = path.dirname(__filename);
export const PORT = process.env.PORT || 3000;
