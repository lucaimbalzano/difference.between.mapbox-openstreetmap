import { parentPort } from "worker_threads";
import { updateOverpass } from "../entities/overpass.service.js";
import { getNomeFromOverpassRegione } from "../utils/functions.js";
import { initializeDataSource } from "../database.typeorm.config.js";
import { getComuneByRegione } from "../entities/comune.service.js";
import { get } from "http";

parentPort.on("message", async (data) => {
  const { overpassData } = data;

  try {
    const AppDataSource = await initializeDataSource();
    for (let y = 0; y < overpassData.length; y++) {
      const overpass = overpassData[y];
      if (overpass.comuneId) continue;
      const regionePrefisso = getNomeFromOverpassRegione(overpass);
      const comune = await getComuneByRegione(regionePrefisso);
      overpass.comuneId = comune.id;
      await updateOverpass(AppDataSource, overpass, overpass.id);
    }
    await AppDataSource.destroy();
    parentPort.postMessage("done");
  } catch (error) {
    parentPort.postMessage(`Error in worker.js:  ${error}`);
  }
});
