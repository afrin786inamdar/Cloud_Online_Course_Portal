const result = require('./result')

function authorizeRole(requiredRole) {
  return (req, res, next) => {
    const userRole = (req.user?.role || '').toLowerCase()
    const needed = (requiredRole || '').toLowerCase()

    if (userRole !== needed) {
      return res.send(result.createResult('Access denied'))
    }

    next()
  }
}

module.exports = { authorizeRole }
