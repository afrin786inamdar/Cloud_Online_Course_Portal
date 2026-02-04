const express = require("express");
const pool = require("../../db/pool");
const result = require("../../utils/result");

const { authUser } = require("../../utils/authjwt");
const { authorizeRole } = require("../../utils/authorizeRole");

const router = express.Router();

// JWT + ADMIN ROLE
router.use(authUser);
router.use(authorizeRole("admin"));

// GET ALL REGISTERED STUDENTS (ADMIN)
router.get("/", (req, res) => {

  const sql = `
    SELECT 
      s.reg_no,
      s.name,
      s.email,
      s.mobile_no,
      c.course_name
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    ORDER BY s.reg_no DESC
  `;

  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data));
  });

});

router.get("/:courseId", (req, res) => {
  const { courseId } = req.params;

  const sql = `
    SELECT 
      s.reg_no,
      s.name,
      s.email,
      s.mobile_no
    FROM students s
    WHERE s.course_id = ?
  `;

  pool.query(sql, [courseId], (error, data) => {
    res.send(result.createResult(error, data));
  });
});

module.exports = router;