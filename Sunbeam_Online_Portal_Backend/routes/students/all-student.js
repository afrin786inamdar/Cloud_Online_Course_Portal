

// 1. Imports
const express = require("express");
const pool = require("../../db/pool");
const result = require("../../utils/result");

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




module.exports = router;
