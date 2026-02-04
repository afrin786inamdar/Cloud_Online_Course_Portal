//this is pool.js file

const mysql=require('mysql2')

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'manager',
    database:'db_Sunbeam_Online_Student_Portal'
})
module.exports=pool;