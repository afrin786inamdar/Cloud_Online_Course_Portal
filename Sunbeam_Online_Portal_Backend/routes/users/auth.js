// const express=require(`express`)
// const cryptojs=require(`crypto-js`)
// const pool=require(`../../db/pool`)
// const result=require(`../../utils/result`)
// const router=express.Router()

// router.post("/signup",(req,res)=>{
//     const { name, email, mobile_no, course_id,role}=req.body;

//     const studentSql=`insert into students(name,email,mobile_no,course_id)values(?,?,?,?)`;

//     const userSql='insert into users(email,password,role)values(?,?,?)';
    
//     const sql='select email from users where email=?';  

//     const defaultPassword='sunbeam'
//     const hashPassword=cryptojs.SHA256(defaultPassword).toString();
    
//     //if email already exist
//     pool.query(sql,[email],(error,data)=>{
//             if(data.length>0){
//                 res.send(result.createResult(error,`Email already registered `))
//             }
//     })
    
//     //adding data into users table

//     pool.query(userSql,[email,hashPassword, role ||"student"],(error,data)=>{
//         res.send(result.createResult(error,data))
//     })
    
//     pool.query(studentSql,[name,email,mobile_no,course_id],(error)=>{
//         res.send(result.createResult(error,`student registered successfully`))
//     })
// })

// module.exports=router;


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

    // Validate input
    if (!name || !email || !mobile_no || !course_id) {
      return res.send(result.createResult('All fields are required'));
    }

    const defaultPassword = 'sunbeam';
    const hashPassword = cryptojs.SHA256(defaultPassword).toString();

    // 1️⃣ Check if email exists
    const checkSql = `SELECT email FROM users WHERE email = ?`;
    const existing = await query(checkSql, [email]);

    if (existing.length > 0) {
      return res.send(result.createResult(null, 'Email already registered'));
    }

    // 2️⃣ Insert into users table
    const userSql = `INSERT INTO users(email, password, role) VALUES (?, ?, ?)`;
    await query(userSql, [email, hashPassword, 'Student']);

    // 3️⃣ Insert into students table
    const studentSql = `INSERT INTO students(name, email, mobile_no, course_id) VALUES (?, ?, ?, ?)`;
    await query(studentSql, [name, email, mobile_no, course_id]);

    // 4️⃣ Send response once
    res.send(result.createResult(null, "Student registered successfully. Default password is 'sunbeam'"));

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

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.send(result.createResult('Email and password are required'));
    }

    // 2️⃣ Check if user exists
    const userSql = `SELECT * FROM users WHERE email = ?`;
    const users = await query(userSql, [email]);

    if (users.length === 0) {
      return res.send(result.createResult(null, 'Email not registered'));
    }

    const user = users[0];

    // 3️⃣ Hash entered password and compare
    const hashedPassword = cryptojs.SHA256(password).toString();
    if (hashedPassword !== user.password) {
      return res.send(result.createResult(null, 'Incorrect password'));
    }

    // 4️⃣ Generate JWT token
    const payload = {
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });

    // 5️⃣ Success response
    return res.send(result.createResult(null, {
      message: `Login successful. Welcome, ${user.email}`,
      token
    }));

  } catch (err) {
    console.error(err);
    res.send(result.createResult(err));
  }
});
router.get('/profile', (req, res) => {
  res.send(result.createResult(null, {
    id: req.user.id,
    email: req.user.email
  }))
})

module.exports = router;
