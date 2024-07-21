const bcrypt = require('bcryptjs')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { NotFoundError, BadRequestError } = require('../errors')

const getUser = async (req, res) => {
	const { userID } = req.user
	const user = await User.findOne({ _id: userID }).select('-password -_id -__v')
	if (!user) {
		throw new NotFoundError(`No user with ID: ${userID}`)
	}
	res.status(StatusCodes.OK).json({ user })
}

const updateUser = async (req, res) => {
	const { userID } = req.user
	// if (req.body.password) {
	// 	const salt = await bcrypt.genSalt(10)
	// 	req.body.password = await bcrypt.hash(req.body.password, salt)
	// }
	const user = await User.findOneAndUpdate(
		{ _id: userID },
		{
			_id: userID, // to prevent updating _id
			...req.body,
		},
		{
			new: true,
			runValidators: true,
		}
	).select('_id name')
	if (!user) {
		throw new NotFoundError(`No user with ID: ${userID}`)
	}
	res.status(StatusCodes.OK).json({ user })
}


const getTotalUsersCount = async (req, res) => {
	const count = await User.countDocuments({})
	res.status(StatusCodes.OK).json({ count })
}

module.exports = { updateUser, getUser, getTotalUsersCount }
