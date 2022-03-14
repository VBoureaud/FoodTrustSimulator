const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.addOne), userController.addOne);

router
  .route('/all')
  .get(userController.allUsers);

router
  .route('/:address')
  .get(validate(userValidation.getOne), userController.getOne)
  .patch(validate(userValidation.updateOne), userController.updateOne)
  .delete(validate(userValidation.deleteOne), userController.deleteOne);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manage user of Food Trust Simulator
 */

/**
 * @swagger
 * /user:
 *   post:
 *    summary: Add One
 *    description: Add an user with public addr & name
 *    tags: [User]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - profile
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *                 description: xrp address
 *               profile:
 *                 type: string
 *               location:
 *                 type: Object
 *                 properties: 
 *                   name:
 *                     type: string
 *                   lat:
 *                     type: string
 *                   lng:
 *                     type: string
 *             example:
 *               name: "Xoer54"
 *               address: "rNgMEpqdVUgReD8ce8UBfHji7wLsNpFAbb"
 *               profile: ""
 *               location: {
 *                 name: 'Kyiv',
 *                 lat: '50.45466',
 *                 lng: '30.5238',
 *                 country: 'UA',
 *               }
 *    responses: 
 *      "200":
 *        description: Ok
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/User'
 *      "400":
 *        $ref: '#/components/responses/DuplicateUser'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *
 */

 /**
 * @swagger
 * /user/{address}:
 *   get:
 *     summary: Get user
 *     description: Get informations for one user.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Address id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 *   patch:
 *     summary: Update an user
 *     description: Update their own information.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Address id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               profile:
 *                 type: string
 *             example:
 *               profile: "cooker"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateUser'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an user
 *     description: delete.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Address id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: get all
 *     description: full list of users
 *     tags: [User]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Users'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */