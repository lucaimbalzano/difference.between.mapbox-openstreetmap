/*
The process of drawing inner polygons is as follows:

@1. Calculate the centroid of the outer polygon.
    In order to get a fixed initial pin (where we can approach) based on the outer polygon

@2. Calculate distance between centroid an 

@3. Draw Pins on the polygon
    We get first the distance between polygon's angles in km (we use haversine formula)
    Based on the distance in km we draw N pins between Polygon's angles ( all perimeter )

@4. Draw inner polygons
    Based on our initial centroid we draw an inner identical polygon ( we draw it approaching to the centroid for 5 meters per time )
    Generate inner polygons with homothetic scaling (we scale the polygon based on the centroid)

@5. Draw Pins on the polygon and exclude all pin outside the outer polygon 
*/

import { convertCoordinatesFormat } from "./utils/functions.js";
import * as turf from "@turf/turf";
import { isPointInsidePolygon } from "./functions.js";

var minArea = 300; // Minimum area to stop scaling (approximately 100 meters)
var scale = 0.9; // Scale factor (e.g., 0.9 --> 90%)
var countPolygonScaled = 0;
var distanceForEachRingPolygon = 85;
var outerPolygon;

function drawInnerPolygonsPerimetersShape(geoJson) {
  let convertedCoordinates = convertCoordinatesFormat(geoJson.coordinates);

  let innerPolygons = createEquidistantInnerPolygons(
    convertedCoordinates,
    distanceForEachRingPolygon
  );

  let pointsPerimeterPolygons = [];
  let sumPoints = 0;
  outerPolygon = turf.polygon(convertedCoordinates);

  // first draw points from outer polygon
  drawPointsFromPolygon(
    outerPolygon,
    pointsPerimeterPolygons,
    turf.area(outerPolygon),
    sumPoints
  );

  for (let i = 0; i < innerPolygons.length; i++) {
    let areaPolygon = turf.area(innerPolygons[i]);
    pointsPerimeterPolygons = getPointsFromPolygon(
      innerPolygons[i].geometry.coordinates[0],
      pointsPerimeterPolygons,
      areaPolygon
    );
    if (pointsPerimeterPolygons[i - 1] == undefined) {
      continue;
    }
    sumPoints += pointsPerimeterPolygons[i - 1].length;
  }
  return { innerPolygons, pointsPerimeterPolygons };
}

function drawPointsFromPolygon(
  polygon,
  pointsPerimeterPolygons,
  areaPolygon,
  sumPoints
) {
  let array = getPointsFromPolygon(
    polygon.geometry.coordinates[0],
    pointsPerimeterPolygons,
    areaPolygon,
    sumPoints
  );
  if (sumPoints == 0) {
    sumPoints += polygon.length;
  } else {
    sumPoints += pointsPerimeterPolygons[i - 1].length;
  }
}

function getPointsFromPolygon(
  polygon,
  allArrayOfPoints,
  areaPolygon,
  isOuterPolygon
) {
  const arrayOfPoints = [];
  let points = [];
  let counter = 0;

  for (let i = 0; i < polygon.length - 1; i++) {
    const point1 = polygon[i];
    const point2 = polygon[i + 1];
    const distance = haversineFormula2PointsDistanceCalculation(
      point1[1],
      point1[0],
      point2[1],
      point2[0]
    );
    let numPoints = Math.floor((distance * 1000) / 50); // num points every 50 meters

    if (areaPolygon < 600) {
      let x = 0;
    }

    if (numPoints == 3 && areaPolygon < 30000) {
      numPoints = 1;
    } else if (numPoints == 0) {
      if (areaPolygon > 30000) {
        numPoints = 3;
      } else {
        numPoints = 2;
      }
    } else if (numPoints == 1) {
      numPoints = 2;
    }

    if (numPoints == 2) {
      points = [point1, point2];
    } else {
      points = interpolatePointsBetween2GivenPoints(
        point1[1],
        point1[0],
        point2[1],
        point2[0],
        numPoints
      );
    }

    // Check if is inside to the outer polygon
    points.forEach((point) => {
      let pointIsInside = isPointInsidePolygon(
        point[1],
        point[0],
        outerPolygon.geometry.coordinates[0]
      );

      if (isOuterPolygon == 0 || areaPolygon < 23000 || pointIsInside) {
        counter++;
        arrayOfPoints.push(point);
      }
    });
  }
  allArrayOfPoints.push(arrayOfPoints);
  return allArrayOfPoints;
}

function haversineFormula2PointsDistanceCalculation(lon1, lat1, lon2, lat2) {
  const R = 6371.0; // Radius of the Earth in kilometers

  // Convert latitude and longitude from degrees to radians
  const toRadians = (angle) => (angle * Math.PI) / 180;
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;

  // Haversine formula
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;

  return distance;
}

function interpolatePointsBetween2GivenPoints(
  lon1,
  lat1,
  lon2,
  lat2,
  numPoints
) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const lon = lon1 + (lon2 - lon1) * (i / numPoints);
    const lat = lat1 + (lat2 - lat1) * (i / numPoints);
    points.push([lon, lat]);
  }
  return points;
}

function createEquidistantInnerPolygons(polygon, distance) {
  try {
    const innerPolygons = [];

    let currentPolygon = turf.polygon(polygon);
    let counter = 0;

    while (true) {
      const centroid = turf.centroid(currentPolygon);
      const coordinates = currentPolygon.geometry.coordinates[0]
        .map((coord) => {
          const distanceToShrink = turf.distance(turf.point(coord), centroid, {
            units: "meters",
          });
          if (distanceToShrink < distance) {
            return null; // Stop if the distance is less than the required shrink distance
          }
          const shrinkFactor = (distanceToShrink - distance) / distanceToShrink;

          const dx = coord[0] - centroid.geometry.coordinates[0];
          const dy = coord[1] - centroid.geometry.coordinates[1];

          return [
            centroid.geometry.coordinates[0] + dx * shrinkFactor,
            centroid.geometry.coordinates[1] + dy * shrinkFactor,
          ];
        })
        .filter((coord) => coord !== null); // Remove any null coordinates

      if (coordinates.length === 0) {
        break; // Stop if no valid coordinates are left
      }

      counter++;
      // console.log(`Polygon ${counter} created with coordinates:`, coordinates);

      if (coordinates.length < 4) {
        break;
      }

      if (
        coordinates[coordinates.length - 1][0] != coordinates[0][0] &&
        coordinates[coordinates.length - 1][1] != coordinates[0][1]
      ) {
        coordinates.push(coordinates[0]);
      }

      currentPolygon = turf.polygon([coordinates]);
      innerPolygons.push(currentPolygon);

      const area = turf.area(currentPolygon);
      if (area < 1) {
        console.log(`Polygon ${counter} is too small to continue.`);
        break;
      }
    }

    return innerPolygons;
  } catch (error) {
    console.error("Error occurred while getting inner polygons: " + error);
  }
}

export { drawInnerPolygonsPerimetersShape };

// ------------------ UTILS

function pointsArrayToGeoJson(points) {
  return {
    type: "FeatureCollection",
    features: points.map((point) => ({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: point,
      },
    })),
  };
}

function getPolygons(outerPolygon) {
  var innerPolygons = [];
  outerPolygon = turf.polygon([outerPolygon]);
  var currentPolygon = outerPolygon;

  while (turf.area(currentPolygon) > minArea) {
    currentPolygon = homothety(currentPolygon, scale);
    innerPolygons.push(currentPolygon);
    countPolygonScaled++;
    console.log(
      "[" + countPolygonScaled + "]" + "currentPolygon:: minArea",
      turf.area(currentPolygon),
      minArea
    );
  }
  return innerPolygons;
}

function scalePolygon(polygon, scale) {
  var centroid = turf.centroid(polygon);
  var coordinates = polygon.geometry.coordinates[0].map(function (coord) {
    var dx = coord[0] - centroid.geometry.coordinates[0];
    var dy = coord[1] - centroid.geometry.coordinates[1];
    return [
      centroid.geometry.coordinates[0] + dx * scale,
      centroid.geometry.coordinates[1] + dy * scale,
    ];
  });
  return turf.polygon([coordinates]);
}

// Function to perform homothetic scaling of the polygon
function homothety(polygon, scale) {
  var centroid = turf.centroid(polygon).geometry.coordinates;
  var coordinates = polygon.geometry.coordinates[0].map(function (coord) {
    var dx = coord[0] - centroid[0];
    var dy = coord[1] - centroid[1];
    return [centroid[0] + dx * scale, centroid[1] + dy * scale];
  });
  return turf.polygon([coordinates]);
}

function checkPointVerticalToCentroid() {
  // if (i != 0) {
  //   // Check vertical (centroid direction) distance between two rings
  //   let lat1 = innerPolygons[i].geometry.coordinates[0][0][1];
  //   let lon1 = innerPolygons[i].geometry.coordinates[0][0][0];
  //   let lat2 = innerPolygons[i - 1].geometry.coordinates[0][0][1];
  //   let lon2 = innerPolygons[i - 1].geometry.coordinates[0][0][0];
  //   let distanceFromPreviousRing = haversineFormula2PointsDistanceCalculation(
  //     lat1,
  //     lon1,
  //     lat2,
  //     lon2
  //   );
  //   distanceFromPreviousRingResult = distanceFromPreviousRing * 1000 > 7;
  //   console.log("distanceFromPreviousRing", distanceFromPreviousRing * 1000);
  // }
  // second draw points from inner polygons if the area is greater than 7
  // if (distanceFromPreviousRingResult) {
  // }
}

// get concentric inner polygons more close together based on centroid
function getInnerPolygons(geoJson) {
  var innerPolygons = [];
  var currentPolygon = turf.polygon(geoJson.coordinates);

  while (turf.area(currentPolygon) > minArea) {
    currentPolygon = scalePolygon(currentPolygon, scale);
    countPolygonScaled++;
    console.log(
      "[" + countPolygonScaled + "]" + "turf.area(currentPolygon):: minArea",
      turf.area(currentPolygon),
      minArea
    );

    innerPolygons.push(currentPolygon);
  }
  return innerPolygons;
}

function createEquidistantInnerPolygonsBySteps(polygon, steps) {
  const innerPolygons = [];
  const distance = 10; // Distance between polygons in meters

  let currentPolygon = polygon;

  for (let i = 0; i < steps; i++) {
    const centroid = turf.centroid(currentPolygon);
    const coordinates = currentPolygon.geometry.coordinates[0].map((coord) => {
      const distanceToShrink = turf.distance(coord, centroid, {
        units: "meters",
      });
      const shrinkFactor = (distanceToShrink - distance) / distanceToShrink;

      const dx = coord[0] - centroid.geometry.coordinates[0];
      const dy = coord[1] - centroid.geometry.coordinates[1];

      return [
        centroid.geometry.coordinates[0] + dx * shrinkFactor,
        centroid.geometry.coordinates[1] + dy * shrinkFactor,
      ];
    });

    currentPolygon = turf.polygon([coordinates]);
    innerPolygons.push(currentPolygon);
  }

  return innerPolygons;
}

function calculateCentroid(polygon) {
  let area = 0.0;
  let x = 0.0;
  let y = 0.0;
  const points = polygon;

  for (let i = 0, len = points.length; i < len - 1; i++) {
    const x0 = points[i][0];
    const y0 = points[i][1];
    const x1 = points[i + 1][0];
    const y1 = points[i + 1][1];
    const a = x0 * y1 - x1 * y0;
    area += a;
    x += (x0 + x1) * a;
    y += (y0 + y1) * a;
  }

  area /= 2.0;
  x /= 6.0 * area;
  y /= 6.0 * area;

  return [x, y];
}
