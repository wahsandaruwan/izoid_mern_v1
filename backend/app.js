const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3300;
require("./helpers/dbCon")
const adminRoutes = require("./routes/adminRoutes")
const studentRoutes = require("./routes/studentRoutes")
const teacherRoutes = require("./routes/teacherRoutes")
const subjectRoutes = require("./routes/subjectRoutes")
const gradeRoutes = require("./routes/gradeRoutes")
const groupRoutes = require("./routes/groupRoutes")
const classRoutes = require("./routes/classRoutes")
const assignmentRoutes = require("./routes/assignmentRoutes")
const meetingRoutes = require("./routes/meetingRoutes")
const { authUser } = require("./middleware/auth")

// Common middleware
app.use(cors());
app.use(express.json());

// Index route
app.get("/", (req, res) => {
  res.json({ data: "This is a home page" });
});

// Admin routes middleware
app.use('/api/admins', adminRoutes)

// Student routes middleware
app.use('/api/students', studentRoutes)

// Teacher routes middleware
app.use('/api/teachers', teacherRoutes)

// Subject routes middleware
app.use('/api/subjects', authUser, subjectRoutes)

// Grade routes middleware
app.use('/api/grades', authUser, gradeRoutes)

// Group routes middleware
app.use('/api/groups', authUser, groupRoutes)

// Class routes middleware
app.use('/api/classes', authUser, classRoutes)

// Assignment routes middleware
app.use('/api/assignments', authUser, assignmentRoutes)

// Meeting routes middleware
app.use('/api/meetings', authUser, meetingRoutes)

// Bind the connection and listen
app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
