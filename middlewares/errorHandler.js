const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
	const customError = {
		msg: err.message || 'Internal Server Error',
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
	}
	if (err.name === 'ValidationError') {
		customError.msg = Object.values(err.errors)
			.map(item => item.message)
			.join(',')
		customError.statusCode = StatusCodes.BAD_REQUEST
	}
	if (err.code && err.code === 11000) {
		const field = Object.keys(err.keyValue)
		customError.msg = `Duplicate value entered for ${field} field. Please choose another ${field}`
		customError.statusCode = StatusCodes.BAD_REQUEST
	}
	if (err.name === 'CastError') {
		customError.msg = `No entry found with ID: ${err.value}`
		customError.statusCode = StatusCodes.NOT_FOUND
	}
	res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandler
