//this is server.js file

const express=require(`express`)
const authRoutes=require(`./routes/users/auth`)
const coursesrouter = require("./routes/admin/courses/all-course");
const studentsRouter =require("./routes/students/all-student");
const videoRouter = require(`./routes/admin/videos/CRUD`)
const app=express()
app.use(express.json())

app.use("/auth",authRoutes);
app.use("/courses",coursesrouter)
app.use("/students", studentsRouter);
app.use("/videos",videoRouter)

app.listen(`3000`,`localhost`,()=>{
      console.log(`server is started on port 3000`)
})