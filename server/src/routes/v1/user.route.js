const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(userValidation.getUser), userController.getUser)
  .post(validate(userValidation.addOne), userController.addOne);

router
  .route('/all')
  .get(userController.allUsers);

router
  .route('/:address')
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateOne), userController.updateOne)
  .delete(validate(userValidation.deleteOne), userController.deleteOne);

router
  .route('/createAd/:address')
  .post(validate(userValidation.createAd), userController.createAd)

router
  .route('/logout/:address/:server')
  .get(validate(userValidation.logoutUser), userController.logoutUser)

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
 *               - type
 *               - image
 *               - location
 *               - server
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *                 description: xrp address
 *               type:
 *                 type: string
 *                 description: type of player (farmer-cook-manager)
 *               image:
 *                 type: string
 *                 description: concatenation of id for image creation
 *               location:
 *                 type: Object
 *                 properties: 
 *                   name:
 *                     type: string
 *                   lat:
 *                     type: string
 *                   lng:
 *                     type: string
 *               server:
 *                 type: string
 *                 description: nft server where user has be created on-chain
 *             example:
 *               name: "Xoer54"
 *               address: "rNgMEpqdVUgReD8ce8UBfHji7wLsNpFAbb"
 *               type: "farmer"
 *               image: "1-1-1-1-1-1-1-1-1-1"
 *               location: {
 *                 name: 'Kyiv',
 *                 lat: '50.45466',
 *                 lng: '30.5238',
 *                 country: 'UA',
 *               }
 *               server: 'Testnet'
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
 * /user?address={address}&server={server}:
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
 *       - in: path
 *         name: server
 *         required: true
 *         schema:
 *           type: string
 *         description: Server url
 *         example: '"wss://hooks-testnet-v2.xrpl-labs.com"'
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
 *       - in: path
 *         name: server
 *         required: true
 *         schema:
 *           type: string
 *         description: Server url
 *         example: 'wss://hooks-testnet-v2.xrpl-labs.com'
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
 *               type:
 *                 type: string
 *             example:
 *               type: "cook"
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
 * /user/createAd/{address}:
 *   post:
 *     summary: Create an ad
 *     description: Create an ad from a marchant to an user
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
 *               address:
 *                 type: string
 *               message:
 *                 type: string
 *             example:
 *               address: "ro4skjnrFzNoKqt8FF1Br7roYVm9CKVB4"
 *               message: "Come and discover my new stock!"
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

/**
 * @swagger
 * /user/logout/{address}/{server}:
 *   get:
 *     summary: Logout user
 *     description: Logout one user.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: server
 *         required: true
 *         schema:
 *           type: string
 *         description: Server url
 *         example: 'wss://hooks-testnet-v2.xrpl-labs.com'
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 */