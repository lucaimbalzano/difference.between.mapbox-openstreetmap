import "reflect-metadata";
import { getDataSource } from "../database.typeorm.config.js";
import { ComuneEntity } from "./comune.entity.js";

export async function insertComune(comune) {
  try {
    const AppDataSource = await getDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    return await repository.save(comune);
  } catch (error) {
    console.error("Error occurred in insertComune: ", error);
  }
}

export async function createComune(comune) {
  try {
    const AppDataSource = await getDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    return repository.create(comune);
  } catch (error) {
    console.error("Error occurred in createComune: ", error);
  }
}
