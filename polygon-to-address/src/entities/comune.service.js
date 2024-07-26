import "reflect-metadata";
import { initializeDataSource } from "../database.typeorm.config.js";
import { ComuneEntity } from "./comune.entity.js";

export async function insertComune(comune) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    const comune = await repository.save(comune);
    AppDataSource.destroy();
    return comune;
  } catch (error) {
    console.error("Error occurred in insertComune: ", error);
  }
}

export async function createComune(comune) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    const newComune = repository.create(comune);
    AppDataSource.destroy();
    return newComune;
  } catch (error) {
    console.error("Error occurred in createComune: ", error);
  }
}

export async function getComuni() {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    const comuni = await repository.find();
    AppDataSource.destroy();
    return comuni;
  } catch (error) {
    console.error("Error occurred in getComuni: ", error);
  }
}

export async function getComuneByRegione(regione) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    const comuneByRegione = await repository.findOne({ where: { regione } });
    AppDataSource.destroy();
    return comuneByRegione;
  } catch (error) {
    console.error("Error occurred in getComuneByRegione: ", error);
  }
}

export async function getComuneByComune(comune) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    const comuneRetrieved = await repository.findOne({
      where: { comune: comune },
    });
    AppDataSource.destroy();
    return comuneRetrieved;
  } catch (error) {
    console.error("Error occurred in getComuneByRegione: ", error);
  }
}

export async function getComuneByCodFisco(codFisco) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(ComuneEntity);
    const comuneByCodFisco = await repository.findOne({
      where: { codFisco: codFisco },
      relations: { perimeters: true },
    });
    AppDataSource.destroy();
    return comuneByCodFisco;
  } catch (error) {
    console.error("Error occurred in getComuneByCodFisco: ", error);
  }
}
