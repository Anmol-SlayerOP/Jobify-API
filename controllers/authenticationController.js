const crypto = require('crypto')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils')

const register = async (req, res) => {
	req.body.email = req.body.email.toLowerCase()
	const existingUser = await User.findOne({ email: req.body.email })
	if (existingUser) {
		throw new BadRequestError('User with this email has already existed.')
	}
	req.body.verificationToken = crypto.randomBytes(40).toString('hex')
	const user = await User.create(req.body)
	await sendVerificationEmail({
		name: user.name,
		email: user.email,
		verificationToken: user.verificationToken,
		origin: process.env.ORIGIN || 'http://localhost:5173',
	})
	res
		.status(StatusCodes.CREATED)
		.json({ msg: 'Success! Please check your email to verify your account.' })
}

const sendVerificationEmailAgain = async (req, res) => {
	const user = await User.findOne({ email: req.body.email })
	const verificationToken = crypto.randomBytes(40).toString('hex')
	const updatedUser = await User.findOneAndUpdate(
		{ email: req.body.email },
		{ _id: user._id, verificationToken },
		{ new: true, runValidators: true }
	)
	await sendVerificationEmail({
		name: updatedUser.name,
		email: updatedUser.email,
		verificationToken: updatedUser.verificationToken,
		origin: process.env.ORIGIN || 'http://localhost:5173',
	})

	res
		.status(StatusCodes.OK)
		.json({ msg: 'Success! Please check your email to verify your account.' })
}

const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.body
	const user = await User.findOne({ email })
	if (!user) {
		throw new UnauthenticatedError('Verification failed.')
	}
	if (user.isVerified) {
		throw new BadRequestError('Already verified.')
	}
	if (user.verificationToken !== verificationToken) {
		throw new UnauthenticatedError('Verification failed.')
	}
	await User.findOneAndUpdate(
		{ email },
		{
			isVerified: true,
			verifiedAt: Date.now(),
			verificationToken: '',
			_id: user._id,
		}
	)
	res.status(StatusCodes.OK).json({ msg: 'Success! Email verified.' })
}

const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new BadRequestError('Please provide email and password')
	}
	const user = await User.findOne({ email })
	if (!user) {
		throw new UnauthenticatedError('Invalid credentials.')
	}
	const isPasswordMatch = await user.comparePassword(password)
	if (!isPasswordMatch) {
		throw new UnauthenticatedError('Invalid credentials.')
	}
	if (!user.isVerified) {
		throw new UnauthenticatedError('Please verify your email.')
	}
	const token = user.createJWT()
	res.status(StatusCodes.OK).json({
		user: { name: user.name },
		token,
	})
}

const forgotPassword = async (req, res) => {
	const { email } = req.body
	if (!email) {
		throw new BadRequestError('Please provide email of your account.')
	}
	const user = await User.findOne({ email })
	if (user) {
		const passwordToken = crypto.randomBytes(70).toString('hex')
		const tenMinutes = 1000 * 60 * 10
		const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)
		const updatedUser = await User.findOneAndUpdate(
			{ email },
			{ _id: user._id, passwordToken, passwordTokenExpirationDate },
			{ new: true, runValidators: true }
		)
		await sendPasswordResetEmail({
			name: updatedUser.name,
			email: updatedUser.email,
			passwordToken: updatedUser.passwordToken,
			origin: process.env.ORIGIN || 'http://localhost:5173',
		})
	}
	res
		.status(StatusCodes.OK)
		.json({ msg: 'Success! Please check your email for password reset link. (expires in 10 minutes)' })
}

const resetPassword = async (req, res) => {
	const { token, email, newPassword } = req.body
	if (!token || !email || !newPassword) {
		throw new BadRequestError('Please provide all values.')
	}
	const user = await User.findOne({ email })
	if (!user) {
		throw new UnauthenticatedError('Password reset process failed.')
	}
	const currentDate = new Date()
	if (currentDate > user.passwordTokenExpirationDate) {
		throw new UnauthenticatedError('Password reset token is expired.')
	}
	if (token !== user.passwordToken) {
		throw new UnauthenticatedError('Password reset process failed.')
	}
	user.password = newPassword
	user.passwordToken = null
	user.passwordTokenExpirationDate = null
	await user.save()
	res.status(StatusCodes.OK).json({ msg: 'Success! Password is changed.' })
}

module.exports = {
	register,
	login,
	verifyEmail,
	forgotPassword,
	resetPassword,
	sendVerificationEmailAgain,
}
