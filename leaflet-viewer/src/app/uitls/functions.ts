/**
 * Converts a LineString GeoJSON object to a Polygon GeoJSON object.
 * @param {object} lineString - The LineString GeoJSON object.
 * @returns {string} - The converted Polygon GeoJSON object as a string.
 */
export function convertLineStringToPolygon(lineString: any) {
  const coordinates = lineString.coordinates;

  // Ensure the first and last points are the same to close the polygon
  if (
    coordinates.length > 0 &&
    (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1])
  ) {
    coordinates.push(coordinates[0]);
  }

  // Construct the Polygon GeoJSON
  const polygonGeoJSON = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [coordinates],
    },
  };

  return JSON.stringify(polygonGeoJSON);
}
