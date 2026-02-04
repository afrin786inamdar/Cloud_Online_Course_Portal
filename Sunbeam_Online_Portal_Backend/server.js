
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/users/auth");
const coursesRouter = require("./routes/admin/courses/all-course");
const studentsRouter = require("./routes/students/all-student");
const videoRouter = require("./routes/admin/videos/CRUD");
const adminStudentsRouter = require("./routes/students/getStudent");
const adminCourseStudents = require("./routes/admin/courseStudents");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminCourseStudents);

app.use("/auth", authRoutes);
app.use("/courses", coursesRouter);
app.use("/students", studentsRouter);
app.use("/videos", videoRouter);
app.use("/admin/students", adminStudentsRouter);

app.listen(3000, () => {
  console.log("✅ Server started on port 3000");
});
