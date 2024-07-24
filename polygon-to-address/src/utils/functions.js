export function convertCoordinatesFormat(geoJson) {
  let convertedCoordinates;

  if (geoJson[0][0].lng == undefined) {
    convertedCoordinates = [geoJson[0]];
  } else {
    // Convert the array of objects into an array of [lng, lat] arrays
    convertedCoordinates = geoJson[0].map((coord) => [coord.lng, coord.lat]);
    convertedCoordinates.push([geoJson[0][0].lng, geoJson[0][0].lat]);
    convertedCoordinates = [convertedCoordinates];
  }
  return convertedCoordinates;
}

/**
 * Converts an array of coordinates into a POLYGON string in WKT format.
 * @param {Array} coordinates - An array of coordinate pairs [longitude, latitude].
 * @returns {string} - The POLYGON string in WKT format. // Example => 'POLYGON((9.554885 45.667864, 9.554134 45.665583, 9.556044 45.664173, 9.557975 45.664173, 9.559005 45.666469, 9.554885 45.667864))';
 */
export function coordinatesToPolygonWKT(coordinates) {
  // Convert each coordinate pair to a string "longitude latitude"
  const coordinatePairs = coordinates.map((coord) => `${coord[0]} ${coord[1]}`);

  // Join all coordinate pairs with a comma and wrap with POLYGON((...))
  const polygonWKT = `POLYGON((${coordinatePairs.join(", ")}))`;

  return polygonWKT;
}
