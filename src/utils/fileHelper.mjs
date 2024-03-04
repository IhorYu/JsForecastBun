import fs from "fs/promises";

export const getFileData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Reading file error:", error);
    throw error;
  }
};

export const appendFile = async (filePath, data) => {
  try {
    await fs.appendFile(filePath, data + "\n");
  } catch (error) {
    console.error("Appending file error:", error);
    throw error;
  }
};
