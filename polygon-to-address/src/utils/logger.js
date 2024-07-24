import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logToFile = (message, nameFile) => {
  const currentDate = new Date().toISOString();
  const logFilePath = path.join(
    __dirname,
    `/logs/${currentDate}-${nameFile}.log`
  );

  fs.appendFile(logFilePath, message, (err) => {
    if (err) {
      console.error("Error writing to log file", err);
    }
  });
};

export default logToFile;

function prettify(arr) {
  let result = "";
  arr.forEach((obj) => {
    result += JSON.stringify(obj, null, 2) + "\n";
  });
  return result;
}
