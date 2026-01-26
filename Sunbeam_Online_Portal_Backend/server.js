//this is server.js file
const express=require(`express`)

const coursesrouter = require("./routes/admin/courses/all-course");
const studentsRouter =require("./routes/students/all-student");
const app=express();


app.use(express.json())
app.use("/courses",coursesrouter)

app.use("/students", studentsRouter);


app.listen(`3000`,`localhost`,()=>{
      console.log(`server is started on port 3000`)
})