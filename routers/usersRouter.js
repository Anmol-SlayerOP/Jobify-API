const express = require('express')
const {
	updateUser,
	getUser,
	getTotalUsersCount,
} = require('../controllers/usersController')
const authenticationMiddleware = require('../middlewares/authentication')

const router = express.Router()

router.get('/', authenticationMiddleware, getUser)

router.patch('/', authenticationMiddleware, updateUser)

/**
 * @swagger
 * /api/v1/users/count:
 *   get:
 *     summary: Get the status of the API
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "API is running"
 */
router.get('/count', getTotalUsersCount)
/**
 * @swagger
 * /api/v1/users/uploads:
 *   post:
 *     summary: Get the status of the API
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "API is running"
 */

module.exports = router
