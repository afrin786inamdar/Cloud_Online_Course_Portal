

// 1. Imports
const express = require("express");
const pool = require("../../db/pool");
const result = require("../../utils/result");
const cryptojs = require('crypto-js')

const { authUser } = require('../../utils/authjwt')
const { authorizeRole } = require('../../utils/authorizeRole')

const router = express.Router();

router.use(authUser)
router.use(authorizeRole('student'))



// 2. Get courses for a student (by email only)
// students router
router.get("/", (req, res) => {
  const { email } = req.user.email;
  if (!email) {
    return res.send(result.createResult("Email is required"));
  }
  const sql = `
    SELECT 
      c.course_id,
      c.course_name,
      c.description,
      c.fees,
      c.start_date,
      c.end_date,
      c.video_expire_days,
      CASE
        WHEN c.end_date < CURDATE() THEN 'COMPLETED'
        WHEN c.start_date > CURDATE() THEN 'UPCOMING'
        ELSE 'ONGOING'
      END AS course_status,
      COUNT(DISTINCT s2.reg_no) AS student_count
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    LEFT JOIN students s2 ON c.course_id = s2.course_id
    WHERE s.email = ?
    GROUP BY c.course_id
  `;
pool.query(sql, [email], (error, data) => {
    res.send(result.createResult(error, data));
  });
});

router.get('/my-course-with-videos', auth, (req, res) => {
  const { email } = req.user; 

  const sql = `
    SELECT 
      c.course_id, 
      c.course_name, 
      c.description, 
      c.fees,
      v.video_id, 
      v.title, 
      v.youtube_url
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    LEFT JOIN videos v ON c.course_id = v.course_id
    WHERE s.email = ?;
  `;

  pool.query(sql, [email], (error, data) => {
    if (error) {
      res.send(result.createResult(error, null));
    } else if (data.length === 0) {
      res.send(result.createResult(null, 'No enrolled courses found or no videos added yet.'));
    } else {
      
      const courseMap = {};

      data.forEach(row => {
        if (!courseMap[row.course_id]) {
          courseMap[row.course_id] = {
            course_id: row.course_id,
            course_name: row.course_name,
            description: row.description,
            fees: row.fees,
            videos: []
          };
        }

        if (row.video_id) {
          courseMap[row.course_id].videos.push({
            video_id: row.video_id,
            title: row.title,
            youtube_url: row.youtube_url
          });
        }
      });

      const response = Object.values(courseMap);
      res.send(result.createResult(null, response));
    }
  });
});

// Change Password (Student)

router.put('/change-password', (req, res) => {
  const email = req.user.email
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return res.send(result.createResult('oldPassword and newPassword are required'))
  }

  // hash both (same as signin)
  const oldHash = cryptojs.SHA256(oldPassword).toString()
  const newHash = cryptojs.SHA256(newPassword).toString()

  // 1) verify old password
  const checkSql = `SELECT password FROM users WHERE email=?`
  pool.query(checkSql, [email], (err, rows) => {
    if (err) return res.send(result.createResult(err))

    if (rows.length === 0) {
      return res.send(result.createResult('User not found'))
    }

    if (rows[0].password !== oldHash) {
      return res.send(result.createResult('Old password is incorrect'))
    }

    // 2) update to new password
    const updateSql = `UPDATE users SET password=? WHERE email=?`
    pool.query(updateSql, [newHash, email], (err2, data) => {
      if (err2) return res.send(result.createResult(err2))

      return res.send(result.createResult(null, { message: 'Password changed successfully' }))
    })
  })
})
module.exports = router;
