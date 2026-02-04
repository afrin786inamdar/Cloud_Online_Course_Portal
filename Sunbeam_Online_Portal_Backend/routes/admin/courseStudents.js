// routes/admin/courseStudents.js

const express = require("express");
const pool = require("../../db/pool");
const result = require("../../utils/result");

const { authUser } = require("../../utils/authjwt");
const { authorizeRole } = require("../../utils/authorizeRole");

const router = express.Router();

// 🔐 ADMIN ONLY
router.use(authUser);
router.use(authorizeRole("admin"));

/* =========================================
   1️⃣ GET ALL COURSES + STUDENT COUNT (ADMIN)
========================================= */
router.get("/courses-with-count", (req, res) => {
  const sql = `
    SELECT 
      c.course_id,
      c.course_name,
      c.description,
      c.fees,
      DATE_FORMAT(c.start_date,'%Y-%m-%d') AS start_date,
      DATE_FORMAT(c.end_date,'%Y-%m-%d') AS end_date,
      c.video_expire_days,
      COUNT(s.reg_no) AS student_count
    FROM courses c
    LEFT JOIN students s ON c.course_id = s.course_id
    GROUP BY c.course_id
    ORDER BY c.course_id DESC
  `;

  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data));
  });
});

/* =========================================
   2️⃣ GET STUDENTS BY COURSE ID (ADMIN)
========================================= */
router.get("/courses/:courseId/students", (req, res) => {
  const { courseId } = req.params;

  const sql = `
    SELECT reg_no, name, email, mobile_no
    FROM students
    WHERE course_id = ?
  `;

  pool.query(sql, [courseId], (err, data) => {
    res.send(result.createResult(err, data));
  });
});

module.exports = router;
