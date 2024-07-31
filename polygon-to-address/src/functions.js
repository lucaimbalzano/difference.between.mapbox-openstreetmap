import {
  toponimi,
  maxDistance,
  densityOfMarker,
  PATH_URL_INPUT_CATASTO_JSON,
} from "./utils/constants.js";
import logToFile from "../src/utils/logger.js";
import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { checkAllGeomtries } from "./entities/overpass.service.js";

import dotenv from "dotenv";
dotenv.config();

async function metodo2WithMapBox(markers) {
  try {
    let list_address = [];
    let squareSelected = calculateAreaOfPath(markers[0]);
    let allPointsInsidePolygon = getPointsInsidePolygon(
      markers,
      squareSelected
    );
    console.log(
      "metodo2WithMapBox::markers" + JSON.stringify(markers, null, 2)
    );
    console.log(
      "metodo2WithMapBox::allPointsInsidePolygon" +
        JSON.stringify(allPointsInsidePolygon, null, 2)
    );
    for (let index = 0; index < markers[0].length; index++) {
      const element = markers[0][index];
      //   var lat = element["lat"];
      //   var lng = element["lng"];
      var lat = element[0];
      var lng = element[1];
      const response = await getStreetNameFromLocation(
        lng,
        lat,
        process.env.MAPBOX_API_KEY
      );
      if (response["features"].length == 0) {
        list_address.push({ lat: lat, lng: lng, message: "No address found" });
        continue;
      }

      response["features"].forEach((address) => {
        var route, comune, provincia;

        var obj2 = address["context"].filter((item) =>
          item["id"].includes("place.")
        );
        var obj3 = address["context"].filter((item) =>
          item["id"].includes("region.")
        );

        if (address["text_it"]) route = address["text_it"];
        if (obj2.length > 0) comune = obj2[0]["text_it"];
        if (obj3.length > 0) provincia = obj3[0]["short_code"].split("-")[1];

        let id = address["id"];

        if (
          route != undefined &&
          comune != undefined &&
          provincia != undefined
        ) {
          var alreadyFind = list_address.filter(
            (item) => item["route"] == route
          );
          if (alreadyFind.length == 0 && manageToponimo(route) != undefined) {
            list_address.push({
              route: route,
              comune: comune,
              provincia: provincia,
              placeId: id,
            });
          }
        }
      });

      console.log(`metodo2WithMapBox::index[${index}]`);
    }
    return list_address;
    // convertAddressToCatasto(list_address);
  } catch (error) {
    console.error("ERROR METODO 2: ", error);
    logToFile(
      JSON.stringify(
        {
          response: error.message,
        },
        "error"
      )
    );
    return { message: "Error occured: " + error.message };
  }
}

function getPointsInsidePolygon(markers, squareSelected) {
  var center = getCentroid(markers[0]);
  let list_markers = markers[0];
  // GET SUD OVEST
  addMarker(
    list_markers,
    "SO",
    center.lat,
    center.lng,
    maxDistance,
    squareSelected
  );

  console.log(
    "getPointsInsidePolygon::list_markers" +
      JSON.stringify(list_markers, null, 2)
  );

  // GET SUD EST
  addMarker(
    list_markers,
    "SE",
    center.lat,
    center.lng,
    maxDistance,
    squareSelected
  );
  // GET NORD EST
  addMarker(
    list_markers,
    "NE",
    center.lat,
    center.lng,
    maxDistance,
    squareSelected
  );
  // GET NORD OVEST
  addMarker(
    list_markers,
    "NO",
    center.lat,
    center.lng,
    maxDistance,
    squareSelected
  );

  return list_markers;
}

function getCentroid(coordinates) {
  let latSum = 0;
  let lonSum = 0;
  const totalPoints = coordinates.length;

  for (let i = 0; i < totalPoints; i++) {
    latSum += coordinates[i][0];
    lonSum += coordinates[i][1];
  }

  const centroidLat = latSum / totalPoints;
  const centroidLon = lonSum / totalPoints;

  return { lat: centroidLat, lng: centroidLon };
}

// FUNZIONI PER CALCOLARE L'AREA DEL POLIGONO
function calculateAreaOfPath(coordinates) {
  const earthRadius = 6371000;
  let area = 0.0;
  if (coordinates.length > 2) {
    for (let i = 0; i < coordinates.length - 1; i++) {
      const p1 = coordinates[i];
      const p2 = coordinates[i + 1];
      area +=
        toRadians(p2[1] - p1[1]) *
        (2 + Math.sin(toRadians(p1[0])) + Math.sin(toRadians(p2[0])));
    }
    area = (area * earthRadius * earthRadius) / 2.0;
  }
  return Math.abs(area);
}

function toRadians(degree) {
  return (degree * Math.PI) / 180;
}

function manageToponimo(indirizzo) {
  var i = indirizzo;
  var toponimo;
  toponimi.forEach((top) => {
    const replaceToponimo = top["value"].toString() + " ";
    const indexFind = indirizzo
      .toString()
      .toUpperCase()
      .indexOf(replaceToponimo.toUpperCase());
    if (indexFind == 0) {
      toponimo = top["id"];
      i = indirizzo
        .toString()
        .toUpperCase()
        .replace(replaceToponimo.toUpperCase(), "");
    }
  });
  if (toponimo == undefined) {
    return undefined;
  }
  return {
    indirizzo: i,
    toponimo: toponimo.trim().toUpperCase(),
  };
}

async function getStreetNameFromLocation(lat, lng, apiKey) {
  try {
    if (apiKey == undefined) throw new Error("API KEY NOT DEFINED");

    let url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      lng +
      "," +
      lat +
      ".json?limit=1&types=address&language=it&access_token=" +
      apiKey;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching street name from location:", error);
    throw error;
  }
}

// let data = this.httpClient.get<any>(
//     'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
//         lat +
//         ',' +
//         lng +
//         '&key=' +
//         apiKey +
//         '&language=it'
// );

async function handleMultipolygonAreaAddresses(geometries, comune, provincia) {
  let addresses;
  let addresses_list = [];
  for (let i = 0; i < geometries.length; i++) {
    addresses = await checkAllGeomtries(geometries[i]);
    addresses = addresses.map((address) => ({
      geom_street: address.overpass_geom,
      comune: comune,
      provincia: provincia,
      regione: address.overpass_location,
      placeId: address.overpass_idOsm,
      route: address.overpass_name,
    }));
    addresses_list = addresses_list.concat(addresses);
  }
  return addresses_list;
}

async function convertAddressToCatasto(addresses) {
  try {
    const filePath = path.resolve(PATH_URL_INPUT_CATASTO_JSON);
    const inputCatasto = await readJsonFile(filePath);
    const listUffici = inputCatasto.uffici;
    const listComuni = inputCatasto.comuni;
    const listSezioni = inputCatasto.sezioni;

    let lista_indirizzi_a_catasto = [];
    for (let index = 0; index < addresses.length; index++) {
      const element = addresses[index];

      // ignore only number and super strade
      if (
        isOnlyNumber(element.route) ||
        ignoreSS(element.route) ||
        element.route.includes("Strada Provinciale")
      ) {
        continue;
      }

      // RECUPERO L'UFFICIO A CATASTO
      var objUfficio = listUffici.filter((item) =>
        item["value"].includes("-" + element["provincia"].toUpperCase())
      );
      if (objUfficio.length > 0) {
        element["CATASTO_UFFICIO"] = objUfficio[0];
      }

      // RECUPERO IL COMUNE A CATASTO
      if (element["CATASTO_UFFICIO"] != undefined) {
        var objListComuni = listComuni[element["CATASTO_UFFICIO"]["value"]];
        if (objListComuni.length > 0) {
          var objComune = objListComuni.filter((item) =>
            matchComune(element["comune"], item["value"])
          );
          if (objComune.length > 0) {
            element["CATASTO_COMUNE"] = objComune[0];
          }
        }
      }

      // RECUPERA LE SEZIONI
      if (element["CATASTO_COMUNE"] != undefined) {
        var objSezione = listSezioni[element["CATASTO_COMUNE"]["value"]]["F"];
        if (objSezione != undefined) {
          if (objSezione.length > 0) {
            for (let index = 0; index < objSezione.length; index++) {
              const elementSezione = objSezione[index];
              const toponimo = manageToponimo(element["route"]);
              if (toponimo != undefined) {
                lista_indirizzi_a_catasto.push({
                  comune: element["CATASTO_COMUNE"]["value"],
                  sezione: elementSezione["value"],
                  ufficio: element["CATASTO_UFFICIO"]["value"],
                  via: element["route"],
                  placeId: element["placeId"],
                  indirizzo: toponimo["indirizzo"],
                  toponimo: toponimo["toponimo"],
                });
              }
            }
          } else {
            const toponimo = manageToponimo(element["route"]);
            if (toponimo != undefined) {
              lista_indirizzi_a_catasto.push({
                comune: element["CATASTO_COMUNE"]["value"],
                ufficio: element["CATASTO_UFFICIO"]["value"],
                via: element["route"],
                placeId: element["placeId"],
                indirizzo: toponimo["indirizzo"],
                toponimo: toponimo["toponimo"],
              });
            }
          }
        } else {
          const toponimo = manageToponimo(element["route"]);
          if (toponimo != undefined) {
            lista_indirizzi_a_catasto.push({
              comune: element["CATASTO_COMUNE"]["value"],
              ufficio: element["CATASTO_UFFICIO"]["value"],
              via: element["route"],
              placeId: element["placeId"],
              indirizzo: toponimo["indirizzo"],
              toponimo: toponimo["toponimo"],
            });
          }
        }
      }
    }
    if (lista_indirizzi_a_catasto.length == 0) {
      // PROBABILMENTE L'UFFICIO E LA PROVINCIA NON CORRISPONDONO (esempio: monza, budoni, sud sardegna)
      for (let index = 0; index < addresses.length; index++) {
        const element = addresses[index];
        // RECUPERO IL COMUNE A CATASTO
        for (var [key, comuni] of Object.entries(listComuni)) {
          const c = [];
          for (let index = 0; index < c.length; index++) {
            const comune = comuni[index];
            if (matchComune(element["comune"], comune["value"])) {
              element["CATASTO_COMUNE"] = comune;
              element["CATASTO_UFFICIO"] = key;
            }
          }
        }
        // RECUPERA LE SEZIONI
        if (element["CATASTO_COMUNE"] != undefined) {
          var objSezione = listSezioni[element["CATASTO_COMUNE"]["value"]]["F"];
          if (objSezione != undefined) {
            if (objSezione.length > 0) {
              for (let index = 0; index < objSezione.length; index++) {
                const elementSezione = objSezione[index];
                const toponimo = manageToponimo(element["route"]);
                if (toponimo != undefined) {
                  lista_indirizzi_a_catasto.push({
                    comune: element["CATASTO_COMUNE"]["value"],
                    sezione: elementSezione["value"],
                    ufficio: element["CATASTO_UFFICIO"],
                    via: element["route"],
                    placeId: element["placeId"],
                    indirizzo: toponimo["indirizzo"],
                    toponimo: toponimo["toponimo"],
                  });
                }
              }
            } else {
              const toponimo = manageToponimo(element["route"]);
              if (toponimo != undefined) {
                lista_indirizzi_a_catasto.push({
                  comune: element["CATASTO_COMUNE"]["value"],
                  ufficio: element["CATASTO_UFFICIO"],
                  via: element["route"],
                  placeId: element["placeId"],
                  indirizzo: toponimo["indirizzo"],
                  toponimo: toponimo["toponimo"],
                });
              }
            }
          } else {
            const toponimo = manageToponimo(element["route"]);
            if (toponimo != undefined) {
              lista_indirizzi_a_catasto.push({
                comune: element["CATASTO_COMUNE"]["value"],
                ufficio: element["CATASTO_UFFICIO"],
                via: element["route"],
                placeId: element["placeId"],
                indirizzo: toponimo["indirizzo"],
                toponimo: toponimo["toponimo"],
              });
            }
          }
        }
      }
    }
    // if (debugMode) {
    //   console.log("lista_indirizzi_a_catasto: ", lista_indirizzi_a_catasto);
    // }
    return lista_indirizzi_a_catasto;
  } catch (error) {
    console.error("ERROR convertAddressToCatasto(): ", error);
  }
}

function matchComune(comuneGoogle, comuneCatasto) {
  comuneGoogle = replaceAllSpecialCharacters(comuneGoogle).toUpperCase();
  comuneCatasto = comuneCatasto.replace(/\'/gi, "").toUpperCase();
  try {
    if (comuneCatasto.includes("#" + comuneGoogle)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function replaceAllSpecialCharacters(comuneGoogle) {
  var list = [
    {
      original: /\à/gi,
      replace: "a",
    },
    {
      original: /\è/gi,
      replace: "e",
    },
    {
      original: /\é/gi,
      replace: "e",
    },
    {
      original: /\ò/gi,
      replace: "o",
    },
    {
      original: /\ù/gi,
      replace: "u",
    },
    {
      original: /\ì/gi,
      replace: "i",
    },
    {
      original: /\'/gi,
      replace: "",
    },
    {
      original: /\-/gi,
      replace: " ",
    },
  ];
  list.forEach((item) => {
    comuneGoogle = comuneGoogle.replace(item["original"], item["replace"]);
  });
  return comuneGoogle;
}

function addMarker(list_markers, type, baseLat, baseLng, max, square) {
  for (let index = 1; index < max; index++) {
    var lat = 0,
      lng = 0;
    const k = densityOfMarker;
    // if (this.debugMode) {
    //   console.log("KEY: ", k);
    // }
    if (type == "SO" || type == "SE") {
      lat = baseLat - index / k;
    }
    if (type == "NE" || type == "NO") {
      lat = baseLat + index / k;
    }
    if (type == "SO" || type == "NO") {
      lng = baseLng - index / k;
    }
    if (type == "SE" || type == "NE") {
      lng = baseLng + index / k;
    }

    var obj = list_markers.filter((item) => item[0] == lat && item[1] == lng);
    // if (this.debugMode) {
    //   console.log("PUNTI SIMILI TROVATI: ", obj.length);
    // }

    if (obj.length == 0) {
      if (isPointInsidePolygon(lng, lat, list_markers)) {
        list_markers.push({ lat: lat, lng: lng });
      }

      // if (this.debugMode) {
      //   const searchMarker = L.marker([lat, lng], {
      //     icon: this.iconMarker,
      //     title: type + " - " + max + " - " + lat + " - " + lng,
      //     opacity: this.isPointInsidePolygon(lng, lat, list_markers) ? 0.5 : 0.1,
      //   });
      //   this.shownLayers.addLayer(searchMarker);
      //   this.map.addLayer(this.shownLayers);
      //   console.log(type, " - ", max);
      //   console.log("PUNTI DISEGNATI: ", list_markers.length, " ", obj.length);
      // }

      console.log(
        "addMarker::list_markers" + JSON.stringify(list_markers, null, 2)
      );

      if (max == maxDistance) {
        if (type == "NE") {
          addMarker(list_markers, "NO", lat, lng, max - 1, square);
        }
        if (type == "SO") {
          addMarker(list_markers, "SE", lat, lng, max - 1, square);
        }
        if (type == "NO") {
          addMarker(list_markers, "SO", lat, lng, max - 1, square);
        }
        if (type == "SE") {
          addMarker(list_markers, "NE", lat, lng, max - 1, square);
        }
      }
    }
  }
}

// CONTROLLA SE UN PUNTO E DENTRO UN POLIGONO
function isPointInsidePolygon(lat, lng, polygon) {
  let x = lng, // Longitude (x-coordinate)
    y = lat; // Latitude (y-coordinate)
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][1], // Latitude of polygon vertex (y-coordinate)
      yi = polygon[i][0]; // Longitude of polygon vertex (x-coordinate)
    let xj = polygon[j][1], // Latitude of previous polygon vertex (y-coordinate)
      yj = polygon[j][0]; // Longitude of previous polygon vertex (x-coordinate)

    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point resides inside the polygon. The polygon can
 * be convex or concave. The function accounts for holes, by using the even–odd rule, it is an algorithm implemented in vector-based graphic software.
 * link {https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule}
 *
 * @name inside
 * @param {Feature<Point>} point input point
 * @param {Feature<(Polygon|MultiPolygon)>} polygon input polygon or multipolygon
 * @return {Boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 **/
function isPointInsidePolygonEvenOddRuleAlgorithm(point, polygon) {
  var pt = getCoord(point);
  var polys = polygon.geometry.coordinates;
  // normalize to multipolygon
  if (polygon.geometry.type === "Polygon") polys = [polys];

  for (var i = 0, insidePoly = false; i < polys.length && !insidePoly; i++) {
    // check if it is in the outer ring first
    if (inRing(pt, polys[i][0])) {
      var inHole = false;
      var k = 1;
      // check for the point in any of the holes
      while (k < polys[i].length && !inHole) {
        if (inRing(pt, polys[i][k])) {
          inHole = true;
        }
        k++;
      }
      if (!inHole) insidePoly = true;
    }
  }
  return insidePoly;
}

// pt is [x,y] and ring is [[x,y], [x,y],..]
function inRing(pt, ring) {
  var isInside = false;
  for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    var xi = ring[i][0],
      yi = ring[i][1];
    var xj = ring[j][0],
      yj = ring[j][1];
    var intersect =
      yi > pt[1] !== yj > pt[1] &&
      pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }
  return isInside;
}

/**
 * Unwrap a coordinate from a Feature with a Point geometry, a Point
 * geometry, or a single coordinate.
 *
 * @param {*} obj any value
 * @returns {Array<number>} a coordinate
 */
function getCoord(obj) {
  if (
    Array.isArray(obj) &&
    typeof obj[0] === "number" &&
    typeof obj[1] === "number"
  ) {
    return obj;
  } else if (obj) {
    if (
      obj.type === "Feature" &&
      obj.geometry &&
      obj.geometry.type === "Point" &&
      Array.isArray(obj.geometry.coordinates)
    ) {
      return obj.geometry.coordinates;
    } else if (obj.type === "Point" && Array.isArray(obj.coordinates)) {
      return obj.coordinates;
    }
  }
  throw new Error("A coordinate, feature, or point geometry is required");
}

/**
 * Performs the even-odd-rule Algorithm (a raycasting algorithm) to find out whether a point is in a given polygon.
 * This runs in O(n) where n is the number of edges of the polygon.
 *
 * @param {Array} polygon an array representation of the polygon where polygon[i][0] is the x Value of the i-th point and polygon[i][1] is the y Value.
 * @param {Array} point   an array representation of the point where point[0] is its x Value and point[1] is its y Value
 * @return {boolean} whether the point is in the polygon (not on the edge, just turn < into <= and > into >= for that)
 */
const pointInPolygon = function (polygon, point) {
  console.log("polygon", polygon);
  console.log("points", point);
  //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
  let odd = false;
  //For each edge (In this case for each point of the polygon and the previous one)
  for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
    //If a line from the point into infinity crosses this edge
    console.log(`i[${i}-j[${j}]]`);
    console.log(
      "polygon[i][1]: " +
        polygon[i][1] +
        "||point[1]=" +
        point[1] +
        "\n" +
        " polygon[J][1]: " +
        polygon[j][1] +
        "||point[1]=" +
        point[1]
    );
    if (
      polygon[i][1] > point[1] !== polygon[j][1] > point[1] && // One point needs to be above, one below our y coordinate
      // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
      point[0] <
        ((polygon[j][0] - polygon[i][0]) * (point[0] - polygon[i][1])) /
          (polygon[j][1] - polygon[i][1]) +
          polygon[i][0]
    ) {
      // Invert odd
      odd = !odd;
      console.log("odd", odd);
    }
    j = i;
  }
  //If the number of crossings was odd, the point is in the polygon
  return odd;
};

function rayCasting(point, polygon) {
  const n = polygon.length;
  let isIn = false;
  const x = point[0];
  const y = point[1];
  let x1, x2, y1, y2;

  x1 = polygon[n - 1][0];
  y1 = polygon[n - 1][1];

  for (let i = 0; i < n; ++i) {
    x2 = polygon[i][0];
    y2 = polygon[i][1];

    if (y < y1 !== y < y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
      isIn = !isIn;
    }
    x1 = x2;
    y1 = y2;
  }

  return isIn;
}

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(data);
    return json;
  } catch (error) {
    console.error("Error reading the JSON file:", error);
  }
}

function isOnlyNumber(str) {
  return !isNaN(str) && str.trim() !== "" && !isNaN(Number(str));
}

function ignoreSS(str) {
  const regex = /^SS\d+$/;
  return regex.test(str);
}

function normalizeToBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }
    if (value.toLowerCase() === "false") {
      return false;
    }
  }
  return false;
}

function flattenArray(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val),
    []
  );
}

export default metodo2WithMapBox;
export {
  isPointInsidePolygon,
  isPointInsidePolygonEvenOddRuleAlgorithm,
  pointInPolygon,
  rayCasting,
  getStreetNameFromLocation,
  manageToponimo,
  convertAddressToCatasto,
  normalizeToBoolean,
  handleMultipolygonAreaAddresses,
  flattenArray,
};
