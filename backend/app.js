const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3300;
require("./helpers/dbCon")
const adminRoutes = require("./routes/adminRoutes")
const studentRoutes = require("./routes/studentRoutes")
const teacherRoutes = require("./routes/teacherRoutes")

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

// Bind the connection and listen
app.listen(PORT, () => {
  console.log(`Server started at Port ${PORT}`);
});
