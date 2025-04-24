// shipmentRoutes.js
const express = require("express");
const {
  createShipment,
  getShipmentByOrderId,
} = require("../controllers/shipmentController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: API per la gestione delle spedizioni
 */

/**
 * @swagger
 * /api/shipments:
 *   post:
 *      summary: Crea una spedizione
 *      tags: [Shipments]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          orderId:
 *                              type: string
 *                          trackingNumber:
 *                              type: string
 *                          destinationAddress:
 *                              type: string
 *                          currentLocation:
 *                              type: string
 *                          status:
 *                              type: string
 *      responses:
 *          201:
 *              description: Spedizione creata con successo
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: true
 *                              shipment:
 *                                  type: object
 *                                  properties:
 *                                      _id:
 *                                          type: string
 *                                          example: "67c57f9fcf8c893f9013c0ab"
 *                                      orderId:
 *                                          type: string
 *                                          example: "ORD-22222"
 *                                      trackingNumber:
 *                                          type: string
 *                                          example: "TRACK-1740996511553"
 *                                      status:
 *                                          type: string
 *                                          example: "in-preparazione"
 *                                      destinationAddress:
 *                                          type: string
 *                                          example: "BOH"
 *                                      createdAt:
 *                                          type: string
 *                                          format: date-time
 *                                          example: "2025-03-03T10:08:31.556Z"
 *                                      updatedAt:
 *                                          type: string
 *                                          format: date-time
 *                                          example: "2025-03-03T10:08:31.560Z"
 *                                      __v:
 *                                          type: integer
 *                                          example: 0
 *          500:
 *              description: Errore interno del server
 */
router.post("/", createShipment);

/**
 * @swagger
 * /api/shipments/byOrder/{orderId}:
 *   get:
 *     summary: Trova una spedizione dato un orderId (usato per Google Maps)
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'ordine da cercare
 *     responses:
 *       200:
 *         description: Spedizione trovata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 shipment:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                     trackingNumber:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "in-preparazione"
 *                     destinationAddress:
 *                       type: string
 *                     _id:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Spedizione non trovata per questo orderId
 *       500:
 *         description: Errore interno del server
 */
// **Endpoint fetch google , mi viene meglio per la mappa** per trovare la spedizione dato un orderId
router.get("/byOrder/:orderId", getShipmentByOrderId);

module.exports = router;
