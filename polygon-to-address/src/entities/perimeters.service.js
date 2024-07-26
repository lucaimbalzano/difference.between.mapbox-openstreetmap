import "reflect-metadata";
import { initializeDataSource } from "../database.typeorm.config.js";
import { PerimetersEntity } from "./perimeters.entity.js";

export async function insertPerimeter(perimeterData) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(PerimetersEntity);
    await repository.save(perimeterData);
    AppDataSource.destroy();
  } catch (error) {
    console.error("Error occurred in insertperimeterData: ", error);
  }
}

export async function createPerimeter(PerimeterData) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(PerimetersEntity);
    const newPerimeter = repository.create(PerimeterData);
    AppDataSource.destroy();
    return newPerimeter;
  } catch (error) {
    console.error("Error occurred in createPerimeterData: ", error);
  }
}

export async function getAllPerimeters() {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(PerimetersEntity);
    const perimeters = await repository
      .createQueryBuilder("perimeters")
      .where("perimeters.comuneId IS NULL")
      .getMany();
    AppDataSource.destroy();
    return perimeters;
  } catch (error) {
    console.error("Error occurred in getAllPerimeters: ", error);
  }
}

export async function updatePerimeters(perimeter, id) {
  let AppDataSource;
  try {
    AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(PerimetersEntity);
    const perimeterUpdated = await repository.update(id, perimeter);
    return perimeterUpdated;
  } catch (error) {
    console.error("Error occurred in updateOverpass: ", error);
  } finally {
    AppDataSource.destroy();
  }
}
