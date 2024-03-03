import fs from "fs/promises";
import { BASEDIR } from "../../config.mjs";

export const readFileAsync = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Reading file error:", error);
    throw error;
  }
};

export const appendFileAsync = async (filePath, data) => {
  try {
    await fs.appendFile(filePath, data + "\n");
  } catch (error) {
    console.error("Appending file error:", error);
    throw error;
  }
};

export const getDataFromLogs = async () => {
  try {
    const files = await fs.readdir(`${BASEDIR}/data/logs`);
    const dataPromises = files.map((file) =>
      fs.readFile(`${BASEDIR}/data/logs/${file}`, "utf8")
    );
    const filesData = await Promise.all(dataPromises);
    return files.reduce((acc, file, index) => {
      acc[file] = JSON.parse(filesData[index]);
      return acc;
    }, {});
  } catch (error) {
    console.error("Reading log file error:", error);
    return {};
  }
};
