const express = require('express');
const validate = require('../../middlewares/validate');
const citiesValidation = require('../../validations/cities.validation');
const citiesController = require('../../controllers/cities.controller');

const router = express.Router();

router
  .route('/:name')
  .get(validate(citiesValidation.getName), citiesController.getName);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: Cities for world map
 */
 
/**
 * @swagger
 * /cities/{name}:
 *   get:
 *     summary: Get cities
 *     description: Get informations for cities.
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name to search
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Cities'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */