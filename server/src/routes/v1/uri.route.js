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
  .patch(validate(uriValidation.patchUri), uriController.patchUri)
  .delete(validate(uriValidation.deleteUri), uriController.deleteUri);

router
  .route('/parents/:name')
  .get(validate(uriValidation.parentsUri), uriController.parentsUri);

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
 *               name: "726866425346784C3431456D726142684B4878664E4476775A45504653646967554731363639323037303635393830303030303031"
 *               nftToken: "00080000744CE6F2C4E7A070635EFB1798EABB9A632D7543A048C0A200000007"
 *               parents: [ "rBbAWWPASAZSFLKDNWjGJSseS1bEzspjrr1654037716464000024", "rw6q5yHmxMzNQfje7y8G4vyf8AgcT3i9jD1663840867602000015" ]
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
 *         example: '726E4A69644177386648396A4D325A6367585659576972374D4D3541563368704B5731363736383235303234313136303030303033'
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
 *
 *   delete:
 *     summary: Delete an URI
 *     description: Delete metaData informations from database.
 *     tags: [Uri]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name URI
 *         example: '726E4A69644177386648396A4D325A6367585659576972374D4D3541563368704B5731363736383235303234313136303030303033'
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
 * /uri/parents/{name}:
 *   get:
 *     summary: Parents URI
 *     description: Get All parents from an URI from game server.
 *     tags: [Uri]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name URI
 *         example: '726E4A69644177386648396A4D325A6367585659576972374D4D3541563368704B5731363736383235303234313136303030303033'
 *
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