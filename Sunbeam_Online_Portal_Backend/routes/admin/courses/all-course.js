
//1. Importing 
const express = require(`express`);
const pool = require(`../../../db/pool`);

//jwt token
const { authUser } = require('../../../utils/authjwt')
const { authorizeRole } = require('../../../utils/authorizeRole')


// 2.create router 
const result = require(`../../../utils/result`)
const router = express.Router();

//4 . Routes - Courses 

//get only active courses
router.get("/active", (req, res) => {
  const { startDate, endDate, type } = req.query;

  let sql = `
    SELECT *,
    CASE
        WHEN start_date > CURDATE() THEN 'UPCOMING'
        ELSE 'ONGOING'
    END AS course_status
    FROM courses
    WHERE end_date >= CURDATE()
  `;

  const values = [];

  // date range filter
  if (startDate && endDate) {
    sql += ` AND start_date <= ? AND end_date >= ?`;
    values.push(endDate, startDate);
  }

  // type filter (only active types allowed)
  if (type === "upcoming") {
    sql += ` AND start_date > CURDATE()`;
  }
  else if (type === "ongoing") {
    sql += ` AND start_date <= CURDATE() AND end_date >= CURDATE()`;
  }

  pool.query(sql, values, (error, data) => {
    res.send(result.createResult(error, data));
  });
});

//  JWT + ADMIN ROLE starts here
router.use(authUser)
router.use(authorizeRole('admin'))

//1.get all courses (get method)

router.get("/", (req, res) => {
  const { startDate, endDate, type } = req.query;
  let sql = `
      SELECT *,
      CASE
          WHEN end_date < CURDATE() THEN 'COMPLETED'
          WHEN start_date > CURDATE() THEN 'UPCOMING'
          ELSE 'ONGOING'
      END AS course_status
      FROM courses
      WHERE 1 = 1`;

  const values = [];


  // Date filter
  if (startDate && endDate) {
    sql += ` AND start_date <= ? AND end_date >= ?`;
    values.push(endDate, startDate);
  }

  // Course type filter
  if (type === 'completed') {
    sql += ` AND end_date < CURDATE()`;
  }
  else if (type === 'upcoming') {
    sql += ` AND start_date > CURDATE()`;
  }
  else if (type === 'ongoing') {
    sql += ` AND start_date <= CURDATE() AND end_date >= CURDATE()`;
  }

  pool.query(sql, values, (error, data) => {
    res.send(result.createResult(error, data));
  });
});

//2.add courses (all course field should add / post method)

router.post("/", (req, res) => {
  const { course_name, description, fees, start_date, end_date, video_expire_days } = req.body;
  const sql = `insert into courses (course_name, description,fees, start_date,end_date,video_expire_days) values (?,?,?,?,?,?)`
  pool.query(sql, [course_name, description, fees, start_date, end_date, video_expire_days], (error, data) => {
    res.send(result.createResult(error, data))
  })
})
//3.update courses (update by id put method )
router.put("/:course_id", (req, res) => {
  const { course_id } = req.params;

  const {
    course_name,
    description,
    fees,
    start_date,
    end_date,
    video_expire_days
  } = req.body;

  let fields = [];
  let values = [];

  if (course_name) {
    fields.push("course_name = ?");
    values.push(course_name);
  }
  if (description) {
    fields.push("description = ?");
    values.push(description);
  }
  if (fees) {
    fields.push("fees = ?");
    values.push(fees);
  }
  if (start_date) {
    fields.push("start_date = ?");
    values.push(start_date);
  }
  if (end_date) {
    fields.push("end_date = ?");
    values.push(end_date);
  }
  if (video_expire_days) {
    fields.push("video_expire_days = ?");
    values.push(video_expire_days);
  }

  if (fields.length === 0) {
    return res.send(result.createResult("No fields to update"));
  }

  const sql = `
    UPDATE courses
    SET ${fields.join(", ")}
    WHERE course_id = ?
  `;

  values.push(course_id);

  pool.query(sql, values, (error, data) => {
    res.send(result.createResult(error, data));
  });
});

// 4. delete course (delete by id)

router.delete("/:course_id", (req, res) => {
  const { course_id } = req.params;   

  const sql = `DELETE FROM courses WHERE course_id = ?`;

  pool.query(sql, [course_id], (error, data) => {
    res.send(result.createResult(error, data));
  });
});
// 3.export router 
module.exports = router;
