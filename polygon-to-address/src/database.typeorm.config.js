import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Overpass } from "./entities/overpass.entity.js";
import path from "path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
console.log("__dirname: ", __dirname);
export const AppDataSource = new DataSource({
  type: "postgres",
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [__dirname + "/entities/*.entity.js"],
  migrations: [],
  subscribers: [],
});

export const getDataSource = (delay = 3000) => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};
