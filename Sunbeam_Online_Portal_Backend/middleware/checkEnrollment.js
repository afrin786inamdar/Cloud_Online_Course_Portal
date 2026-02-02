const pool = require('../db/pool')
const result = require('../utils/result')

const query = (sql, params) =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })

async function checkEnrollment(req, res, next) {
  const courseId = req.params.courseId
  const email = req.user.email

  const rows = await query(
    'SELECT * FROM students WHERE email=? AND course_id=?',
    [email, courseId]
  )

  if (rows.length === 0) {
    return res.send(result.createResult('Access denied'))
  }

  next()
}

module.exports = { checkEnrollment }
