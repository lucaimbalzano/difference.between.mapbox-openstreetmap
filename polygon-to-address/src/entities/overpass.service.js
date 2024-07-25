import "reflect-metadata";
import { initializeDataSource } from "../database.typeorm.config.js";
import { OverpassEntity } from "./overpass.entity.js";
import { coordinatesToPolygonWKT } from "../utils/functions.js";

async function getOverpassByLocation(location) {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(OverpassEntity);
    return await repository
      .createQueryBuilder("overpass")
      .where("overpass.location = :location", { location })
      .limit(10)
      .getMany();
  } catch (error) {
    console.error("Error occurred in getOverpassByLocation: ", error);
  }
}

export async function updateOverpass(AppDataSource, overpass, id) {
  try {
    const repository = AppDataSource.getRepository(OverpassEntity);
    return await repository.update(id, overpass);
  } catch (error) {
    console.error("Error occurred in updateOverpass: ", error);
  }
}

export async function getAllOverpass() {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(OverpassEntity);
    return await repository.find();
  } catch (error) {
    console.error("Error occurred in getAllOverpass: ", error);
  }
}

export async function getAllOverpassWithComuneIdNull() {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(OverpassEntity);
    return await repository.find({ where: { comuneId: null } });
  } catch (error) {
    console.error("Error occurred in getAllOverpass: ", error);
  }
}

export async function getOverpassWithComuneIdNullQBuilder() {
  try {
    const AppDataSource = await initializeDataSource();
    const repository = AppDataSource.getRepository(OverpassEntity);
    const overpassList = await repository
      .createQueryBuilder("overpass")
      .where("overpass.comuneId IS NULL")
      .getMany();
    return overpassList;
  } catch (error) {
    console.error("Error occurred in getAllOverpassWithComuneIdNull: ", error);
  }
}

export async function checkAllGeomtries(geometries) {
  try {
    const AppDataSource = await initializeDataSource();

    const polygonWKT = coordinatesToPolygonWKT(geometries[0]);

    const repository = AppDataSource.getRepository(OverpassEntity);
    const intersectingLines = await repository
      .createQueryBuilder("overpass")
      .select([
        "overpass.id",
        "overpass.location",
        "overpass.geom",
        "overpass.type_location",
        "overpass.name",
        "overpass.surface",
        "overpass.type",
      ])
      .distinctOn(["overpass.name"])
      .where(
        "ST_Intersects(overpass.geom, ST_GeomFromText(:polygonWKT, 4326))",
        { polygonWKT }
      )
      .orderBy("overpass.name")
      .addOrderBy("overpass.id")
      .getRawMany();

    return intersectingLines;
  } catch (error) {
    console.error("Error occurred in getOverpassByLocation: ", error);
  }
}

export { getOverpassByLocation };
