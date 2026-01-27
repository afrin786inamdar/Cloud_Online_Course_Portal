const jwt = require('jsonwebtoken')
const result = require('./result')
const config = require('./config')

//  Verify token for user side
function authUser(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.send(result.createResult('Missing token'))
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET)

    req.user = {
      email: payload.email,
      role: payload.role   // keep as it is, we will normalize in authorizeAdmin
    }

    next()
  } catch (err) {
    return res.send(result.createResult('Invalid token'))
  }
}

//  Admin authorization 

function authorizeAdmin(req, res, next) {
  const role = (req.user?.role || '').toLowerCase()

  if (role !== 'admin') {
    return res.send(result.createResult('Access denied'))
  }

  next()
}

module.exports = { authUser, authorizeAdmin }
