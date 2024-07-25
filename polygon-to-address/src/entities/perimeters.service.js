import "reflect-metadata";
import { initializeDataSource } from "../database.typeorm.config.js";
import { PerimetersEntity } from "./perimeters.entity.js";

export async function insertPerimeter(perimeterData) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(PerimetersEntity);
    return await repository.save(perimeterData);
  } catch (error) {
    console.error("Error occurred in insertperimeterData: ", error);
  }
}

export async function createPerimeter(PerimeterData) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(PerimetersEntity);
    return repository.create(PerimeterData);
  } catch (error) {
    console.error("Error occurred in createPerimeterData: ", error);
  }
}
