import "reflect-metadata";
import { initializeDataSource } from "../database.typeorm.config.js";
import { ComuneEntity } from "./comune.entity.js";

export async function insertComune(comune) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    return await repository.save(comune);
  } catch (error) {
    console.error("Error occurred in insertComune: ", error);
  }
}

export async function createComune(comune) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    return repository.create(comune);
  } catch (error) {
    console.error("Error occurred in createComune: ", error);
  }
}

export async function getComuni() {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    return await repository.find();
  } catch (error) {
    console.error("Error occurred in getComuni: ", error);
  }
}

export async function getComuneByRegione(regione) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    return await repository.findOne({ where: { regione } });
  } catch (error) {
    console.error("Error occurred in getComuneByRegione: ", error);
  }
}
