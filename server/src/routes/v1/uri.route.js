const express = require('express');
const validate = require('../../middlewares/validate');
const uriValidation = require('../../validations/uri.validation');
const uriController = require('../../controllers/uri.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(uriValidation.queryUris), uriController.queryUris)
  .post(validate(uriValidation.register), uriController.register);

router
  .route('/:name')
  .patch(validate(uriValidation.patchUri), uriController.patchUri);

router
  .route('/history/:tokenId')
  .get(validate(uriValidation.historyUri), uriController.historyUri);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Uri
 *   description: Uri routes
 */

/**
 * @swagger
 * /uri:
 *   post:
 *    summary: Add URI
 *    description: Add an uri linked to a NFToken
 *    tags: [Uri]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - nftToken
 *             properties:
 *               name:
 *                 type: string
 *                 description: URI name
 *               nftToken:
 *                 type: string
 *                 description: NftToken address
 *             example:
 *               name: "rMdVH3owD3c2FRVdqVBaxjdUkwLkHxVmdr1646947693887000001"
 *               nftToken: "0008000008AB50D2C6251686E42480AF556F5FEF110C0CCE0000099B00000000"
 *    responses: 
 *      "200":
 *        description: Ok
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/MetaData'
 *      "400":
 *        $ref: '#/components/responses/DuplicateMetaData'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get URIs filtered
 *     description: Queries URIs needed.
 *     tags: [Uri]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Uri name
 *       - in: query
 *         name: nftToken
 *         schema:
 *           type: string
 *         description: NftToken name
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Address to find
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of Uris
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MetaData'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */


 /**
 * @swagger
 * /uri/{name}:
 *   patch:
 *     summary: Update an URI
 *     description: Update metaData informations.
 *     tags: [Uri]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name URI
 *         example: 'rMdVH3owD3c2FRVdqVBaxjdUkwLkHxVmdr1646947693887000001'
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *               offerBuy:
 *                 type: string
 *               parents:
 *                 type: string
 *             example:
 *               owner: 'rMdVH3owD3c2FRVdqVBaxjdUkwLkHxVmdr'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MetaData'
 *       "400":
 *         $ref: '#/components/responses/DuplicateMetaData'
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
 * /uri/history/{tokenId}:
 *   get:
 *     summary: Get history location
 *     description: Get history with more informations.
 *     tags: [Uri]
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID
 *         example: ''
 * 
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/History'
 *       "400":
 *         $ref: '#/components/responses/DuplicateMetaData'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */