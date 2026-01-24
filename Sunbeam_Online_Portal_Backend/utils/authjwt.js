const jwt = require('jsonwebtoken')
const result = require('./result')
const config = require('./config')

function authUser(req, res, next) {

  // Public routes
  const openRoutes = ['/users/signup', '/users/signin']

  if (openRoutes.includes(req.originalUrl)) {
    return next()
  }

  // Get token from Authorization header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.send(result.createResult('Missing token'))
  }

  try {
    const payload = jwt.verify(token, config.SECRET)

    // Attach user info to request
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    }

    next()
  } catch (err) {
    return res.send(result.createResult('Invalid token'))
  }
}

module.exports = { authUser }
