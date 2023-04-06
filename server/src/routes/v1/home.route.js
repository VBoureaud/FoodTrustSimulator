const express = require('express');
const homeController = require('../../controllers/home.controller');
const router = express.Router();

router
  .route('/')
  .get(homeController.getHome)

router
  .route('/ably/auth')
  .get(homeController.getWss)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Home Route
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello World
 *     tags: [Home]
 *     responses:
 *       "200":
 *         description: Greeting 
 *
 */
