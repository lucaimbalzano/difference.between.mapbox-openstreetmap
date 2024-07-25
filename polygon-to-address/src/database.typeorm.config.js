import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "node:url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createDataSource = () => {
  return new DataSource({
    type: "postgres",
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [__dirname + "/entities/*.entity.js"],
    migrations: [],
    subscribers: [],
    extra: {
      max: 20, // Maximum number of connections in the pool
      idleTimeoutMillis: 30000, // 30 seconds
    },
  });
};

export const initializeDataSource = async () => {
  const AppDataSource = createDataSource();
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};
