
// routes/users/auth.js
const express = require('express');
const cryptojs = require('crypto-js');
const pool = require('../../db/pool');
const result = require('../../utils/result');
const config=require(`../../utils/config`)
const jwt=require(`jsonwebtoken`)

const router = express.Router();

// Helper function to query with async/await
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile_no, course_id } = req.body;

    if (!name || !email || !mobile_no || !course_id) {
      return res.send(result.createResult('All fields are required'));
    }

    const defaultPassword = 'sunbeam';
    const hashPassword = cryptojs.SHA256(defaultPassword).toString();

    // check user exists
    const checkUser = await query(
      "SELECT email FROM users WHERE email=?",
      [email]
    );

    // If first time signup → create account
    if (checkUser.length === 0) {

      await query(
        "INSERT INTO users(email,password,role) VALUES (?,?,?)",
        [email, hashPassword, 'student']
      );
    }

    // check course already enrolled
    const checkEnroll = await query(
      "SELECT reg_no FROM students WHERE email=? AND course_id=?",
      [email, course_id]
    );

    if (checkEnroll.length > 0) {
      return res.send(result.createResult("Already enrolled in this course"));
    }

    // enroll into course
    await query(
      "INSERT INTO students(name,email,mobile_no,course_id) VALUES (?,?,?,?)",
      [name, email, mobile_no, course_id]
    );

    res.send(result.createResult(null, "Course enrolled successfully"));

  } catch (err) {
    console.error(err);
    res.send(result.createResult(err));
  }
});


// =======================
// SIGN-IN / LOGIN ROUTE
// =======================
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️ Validate input
    if (!email || !password) {
      return res.send(result.createResult('Email and password are required'));
    }

    // 2️ Check if user exists
    const userSql = `SELECT * FROM users WHERE email = ?`;
    const users = await query(userSql, [email]);

    if (users.length === 0) {
      return res.send(result.createResult(null, 'Email not registered'));
    }

    const user = users[0];

    // 3️ Hash entered password and compare
    const hashedPassword = cryptojs.SHA256(password).toString();
    if (hashedPassword !== user.password) {
      return res.send(result.createResult(null, 'Incorrect password'));
    }

    // 4️ Generate JWT token
    const payload = {
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });

    // 5️ Success response
    // return res.send(result.createResult(null, {
    //   message: `Login successful. Welcome, ${user.email}`,
    //   token
    // }));

    return res.send(result.createResult(null, {
  token: token,
  role: user.role,
  email: user.email
}));

  } catch (err) {
    console.error(err);
    res.send(result.createResult(err));
  }
});


module.exports = router;
