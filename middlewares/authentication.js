const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')



const auth = (req, res, next) => {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new UnauthenticatedError('Invalid token.')
	}
	const token = authHeader.split(' ')[1]
	try {
		const { userID, name } = jwt.verify(token, process.env.JWT_SECRET) // userID and name are added to request payload
		req.user = { userID, name }
		next()
	} catch (error) {
		throw new UnauthenticatedError('Invaild token.')
	}
}

module.exports = auth
