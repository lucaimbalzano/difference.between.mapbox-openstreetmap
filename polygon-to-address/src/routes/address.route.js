import express from "express";
import {
  test,
  polygon,
  city,
  drawInnerPolygonsPerimeters,
  getAddressesByPolygonDB,
  getAddressesLiguria,
  loadComuniItaliani,
  loadZoneItaliani,
  migrationsComuneOverpass,
  // migrationsComuneOverpassWhereComuneIDIsNULL,
  migrationsComuneOverpassWhereComuneIDIsNULLWorkers,
} from "../controller/address.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/get-addresses/test:
 *   get:
 *     summary: Test endpoint
 *     description: Returns a test message
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/test", test);

/**
 * @swagger
 * /api/get-addresses/polygon:
 *   post:
 *     summary: Polygon endpoint
 *     description: Processes polygon data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               markers:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: [
 *                   [9.554885, 45.667864],
 *                   [9.554134, 45.665583],
 *                   [9.556044, 45.664173],
 *                   [9.557975, 45.664173],
 *                   [9.559005, 45.666469],
 *                   [9.554885, 45.667864]
 *                 ]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid request
 */
router.post("/polygon", polygon);

/**
 * @swagger
 * /api/get-addresses/city:
 *   post:
 *     summary: Get addresses by city
 *     description: Processes polygon data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               markers:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: Milan
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid request
 */
router.post("/city", city);

/**
 * @swagger
 * /api/get-addresses/draw-inner-polygons-perimeter:
 *   post:
 *     summary: Get addresses after drawn polygons
 *     description: Processes polygon data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               markers:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: [
 *                   [9.554885, 45.667864],
 *                   [9.554134, 45.665583],
 *                   [9.556044, 45.664173],
 *                   [9.557975, 45.664173],
 *                   [9.559005, 45.666469],
 *                   [9.554885, 45.667864]
 *                 ]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid request
 */
router.post("/draw-inner-polygons-perimeter", drawInnerPolygonsPerimeters);

/**
 * @swagger
 * /api/get-addresses/Liguria:
 *   post:
 *     summary: Get Addresses by Spatial Query on local db
 *     description: Processes polygon data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid request
 */
router.get("/Liguria", getAddressesLiguria);

/**
 * @swagger
 * /api/get-addresses/get-addresses-by-polygon/db:
 *   post:
 *     summary: Get Addresses by Spatial Query on local db
 *     description: Processes polygon data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               markers:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 example: [[
 *                   [9.554885, 45.667864],
 *                   [9.554134, 45.665583],
 *                   [9.556044, 45.664173],
 *                   [9.557975, 45.664173],
 *                   [9.559005, 45.666469],
 *                   [9.554885, 45.667864]
 *                 ]]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid request
 */
router.post("/get-addresses-by-polygon/db", getAddressesByPolygonDB);

/**
 * @swagger
 * /api/get-addresses/load-comuni-italiani:
 *   get:
 *     summary: load comuni italiani
 *     description: Insert to db comuni italiani based on txt file
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/load-comuni-italiani", loadComuniItaliani);

/**
 * @swagger
 * /api/get-addresses/load-zone-italiani:
 *   get:
 *     summary: load zone italiane
 *     description: Insert to db zone
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/load-zone-italiani", loadZoneItaliani);

// #### MIGRATIONS ####

//COMUNE
// comune
// ----------+ relationship comune + comune_name
//PERIMETER
// properties
// {"reg_name":"Lombardia","prov_name":"Como","prov_acr":"CO","comune_name":"Argegno","old_id":"7514"}
// ----------+ relationship reg_name + location
//OVERPASS
// location

/**
 * @swagger
 * /api/get-addresses/migrations-comune-overpass:
 *   get:
 *     summary: migrations comune to overpass 1-N
 *     description: migrations
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/migrations-comune-overpass", migrationsComuneOverpass);

/**
 * @swagger
 * /api/get-addresses/migrations-comune-overpass-with-comune-id-null:
 *   get:
 *     summary: migrations comune to overpass 1-N with comuneId is null
 *     description: migrations
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get(
  "/migrations-comune-overpass-with-comune-id-null",
  // migrationsComuneOverpassWhereComuneIDIsNULL
  migrationsComuneOverpassWhereComuneIDIsNULLWorkers
);

export default router;
