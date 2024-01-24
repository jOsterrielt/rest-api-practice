import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export const readJSON = (path) => require(path);

/* import fs from "fs/promises";

export const readJSON = async (path) => {
  try {
    const data = await fs.readFile(path, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file at ${path}: ${error.message}`);
    throw error;
  }
};
 */
