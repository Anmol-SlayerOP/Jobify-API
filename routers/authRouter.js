const express = require('express')
const {
	register,
	login,
	verifyEmail,
	forgotPassword,
	resetPassword,
	sendVerificationEmailAgain,
} = require('../controllers/authenticationController')

const router = express.Router()
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Get user by ID
 */
router.post('/register', register)
router.post('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/send-verification-email-again', sendVerificationEmailAgain)

module.exports = router
