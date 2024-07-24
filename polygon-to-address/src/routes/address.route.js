import express from "express";
import {
  test,
  polygon,
  city,
  drawInnerPolygonsPerimeters,
  getAddressesByPolygonDB,
  getAddressesLiguria,
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

export default router;
