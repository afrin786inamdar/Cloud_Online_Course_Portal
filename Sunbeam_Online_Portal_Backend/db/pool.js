//this is pool.js file

const mysql=require('mysql2')

const pool=mysql.createPool({
    host:'localhost',
    user:' ',
    password:' ',
    database:'project_db'
})

module.exports=pool;