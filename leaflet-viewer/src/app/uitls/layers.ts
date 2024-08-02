// src/utils/layers.js
import L from "leaflet";
import * as turf from "@turf/turf";
import { Position } from "geojson";
import { Position } from "geojson";
const thunderforestApiKey = process.env.MAP_THUNDER_LAYERS_KEY;
console.log(thunderforestApiKey);
export const myStyle = {
  color: "#0c60a6",
  weight: 5,
  opacity: 0.65,
};

export const myLineStyle = {
  color: "#FF0000",
  weight: 3,
  opacity: 0.65,
};

export const addPolygonLayer = (map: any, geometries: any[]) => {
  geometries.forEach((geometry: Position[][]) => {
    const polygon = turf.polygon(geometry);
    L.geoJSON(polygon, { style: myStyle }).addTo(map);
  });
};

export const addSinglePolygonLayer = (map: any, geometry: Position[][]) => {
  const polygon = turf.polygon(geometry);

  L.geoJSON(polygon, { style: myStyle }).addTo(map);
  return polygon;
};

export const addLineLayer = (map: any, lines: any) => {
  L.geoJSON(lines, { style: myLineStyle }).addTo(map);
};

export const createTileLayers = () => {
  const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  });

  const osmHOT = L.tileLayer(
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
    }
  );

  var Stadia_AlidadeSmoothDark = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "png",
    }
  );

  const Stadia_AlidadeSmooth = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution: "Stadia Alidade Smooth",
      ext: "png",
    }
  );

  var Stadia_AlidadeSatellite = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution:
        '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "jpg",
    }
  );

  var Stadia_StamenToner = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "png",
    }
  );
  var Stadia_StamenWatercolor = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}",
    {
      minZoom: 1,
      maxZoom: 16,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "jpg",
    }
  );

  var Stadia_StamenTerrainBackground = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "png",
    }
  );

  var OpenCycleMap = L.tileLayer(
    `https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      apikey: thunderforestApiKey,
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var Transport = L.tileLayer(
    `https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var Landscape = L.tileLayer(
    `https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var Outdoors = L.tileLayer(
    `https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var TransportDark = L.tileLayer(
    `https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var SpinalMap = L.tileLayer(
    `https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var Pioneer = L.tileLayer(
    `https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var MobileAtlas = L.tileLayer(
    `https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var Neighbourhood = L.tileLayer(
    `https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  var Atlas = L.tileLayer(
    `https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`,
    {
      maxZoom: 22,
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  return {
    osm,
    osmHOT,
    Stadia_AlidadeSmoothDark,
    Stadia_AlidadeSmooth,
    Stadia_AlidadeSatellite,
    Stadia_StamenToner,
    Stadia_StamenWatercolor,
    Stadia_StamenTerrainBackground,
    OpenCycleMap,
    Transport,
    Landscape,
    Outdoors,
    TransportDark,
    SpinalMap,
    Pioneer,
    MobileAtlas,
    Neighbourhood,
    Atlas,
  };
};
