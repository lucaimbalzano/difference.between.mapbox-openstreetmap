import "reflect-metadata";
import metodo2WithMapBox, { getStreetNameFromLocation } from "../functions.js";
import { drawInnerPolygonsPerimetersShape } from "../functions.draw-inner-polygons.js";
import logToFile from "../utils/logger.js";
import { convertCoordinatesFormat } from "../utils/functions.js";
import { manageToponimo } from "../functions.js";
import {
  getOverpassByLocation,
  checkAllGeomtries,
} from "../entities/overpass.service.js";

import dotenv from "dotenv";
dotenv.config();

export const test = (req, res) => {
  res.json({ message: "Api route is working correctly." });
};

export const polygon = async (req, res, next) => {
  try {
    if (req.body) {
      let lista_indirizzi_a_catasto = await metodo2WithMapBox(req.body);
      const logData = {
        lista_indirizzi_a_catasto: lista_indirizzi_a_catasto,
        response: res.statusCode,
      };
      logToFile(JSON.stringify(logData, null, 2), "logger");

      return res.status(200).json(
        JSON.stringify(
          {
            response: res.statusCode,
            lista_indirizzi_a_catasto: lista_indirizzi_a_catasto,
          },
          null,
          2
        )
      );
    } else {
      return res
        .status(400)
        .json({ message: "Error occurred, body not valid" });
    }
  } catch (error) {
    next(error);
  }
};

export const city = async (req, res, next) => {
  /*
  https://docs.mapbox.com/api/search/geocoding-v5/#forward-geocoding
  limit -	integer: 
                  Specify the maximum number of results to return.
                  The default is 5 and the maximum supported is 10.

  Possible solution:
  - Bounding Box (bbox): The bbox parameter specifies the area to search within.
                        Adjust the bounding box to target different areas of the city.
                        @example:
                            const bboxList = [
                                // Define multiple bounding boxes to cover the city area
                                [-74.25909, 40.477399, -74.0, 40.6],
                                [-74.0, 40.477399, -73.700181, 40.6],
                                [-74.25909, 40.6, -74.0, 40.917577],
                                [-74.0, 40.6, -73.700181, 40.917577]
                            ];
  - Limit: The limit parameter in the request is still set, but it won't exceed Mapbox's maximum.
  - Pagination: By dividing the city into smaller regions and fetching addresses for each region, 
                you can effectively paginate the results.
  */
  try {
    const { cityName, mapboxToken, limit = 500 } = req.body;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      cityName
    )}.json`;
    const params = new URLSearchParams({
      access_token: mapboxToken,
      limit: limit,
      types: "address",
    });

    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const addresses = data.features.map((feature) => feature.place_name);
    logToFile(
      JSON.stringify(
        {
          response: res.statusCode,
          city: cityName,
          indirizzi: addresses,
        },
        null,
        2
      ),
      "logger"
    );
    return res.status(200).json(
      JSON.stringify(
        {
          response: res.statusCode,
          city: cityName,
          indirizzi: addresses,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error in city function", error);
    next(error);
  }
};

export const getAddressesLiguria = async (req, res, next) => {
  console.log("getAddressesByPolygonDB, request with success");
  const result = await getOverpassByLocation("Liguria");
  return res.status(200).json({ message: "Brav uaglio'!", response: result });
};

export const getAddressesByPolygonDB = async (req, res, next) => {
  console.log("getAddressesByPolygonDB, request with success");
  let coordinates = convertCoordinatesFormat(req.body);
  const result = await checkAllGeomtries(coordinates);

  const list_address = result.map((address) => ({
    name: address.overpass_name,
    location: address.overpass_location,
  }));
  const list_geomtries = result.map((address) => address.overpass_geom);
  console.log("osm list_address", list_address);
  return res.status(200).json(
    JSON.stringify(
      {
        response: res.statusCode,
        message: "getAddressesByPolygonDB function is working correctly.",
        addresses: {
          indirizzi_found: result.length,
          indirizzi_osm: {
            list_address: list_address,
            list_geomtries: list_geomtries,
          },
        },
      },
      null,
      2
    )
  );
};

export const drawInnerPolygonsPerimeters = async (req, res, next) => {
  try {
    if (req.body) {
      const coordinates =
        req.body.markers === undefined ? req.body : req.body.markers;

      const geometry = {
        type: "Polygon",
        coordinates: coordinates,
      };

      const feature = {
        type: "Feature",
        properties: { geometry: geometry },
      };

      const geoJson = {
        type: "FeatureCollection",
        features: [feature],
      };

      const polygons = drawInnerPolygonsPerimetersShape(geometry);

      let list_address = await getAddressesByMapBoxEndPoint(polygons);
      console.log("mapbox list_address", list_address);
      logToFile(
        JSON.stringify(
          {
            indirizzi_found: list_address.length,
            indirizzi: list_address,
          },
          null,
          2
        ),
        "logger"
      );

      return res.status(200).json(
        JSON.stringify(
          {
            response: res.statusCode,
            message: "drawInnerPolygons function is working correctly.",
            coordinates: polygons,
            addresses: {
              indirizzi_found: list_address.length,
              indirizzi: list_address,
            },
            linkToFileInTheSysExample:
              "file:///Users/lucaimbalzano/Documents/Workspaces/Loud/polygon-to-address/src/view/polygons-layers-visualization.html",
          },
          null,
          2
        )
      );
    } else {
      return res
        .status(500)
        .json({ message: "Error occurred, body not valid" });
    }
  } catch (error) {
    console.error(
      "Error occured while drawing inner polygons in drawInnerPolygonsPerimeters: " +
        error
    );
  }
};

async function getAddressesByMapBoxEndPoint(polygons) {
  let list_address = [];
  let counter = 0;
  console.log("Started making requests please wait...");
  for (let i = 0; i < polygons.pointsPerimeterPolygons.length; i++) {
    for (let j = 0; j < polygons.pointsPerimeterPolygons[i].length; j++) {
      let point = polygons.pointsPerimeterPolygons[i][j];
      const lng = point[0];
      const lat = point[1];

      const response = await getStreetNameFromLocation(
        lng,
        lat,
        process.env.MAPBOX_API_KEY
      );

      counter++;

      if (response["features"].length == 0) {
        list_address.push({
          lat: lat,
          lng: lng,
          message: "No address found",
        });
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
    }
  }
  console.log("request[" + counter + "]");
  console.log("list_address.length", list_address.length);
  return list_address;
}
