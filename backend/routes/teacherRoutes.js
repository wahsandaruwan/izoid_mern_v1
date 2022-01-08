const express = require('express')
const router = express.Router()
const { teacherRegistration, teacherLogin, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, getTeachersBySearch, getTeacherByRegNum } = require("../controllers/teacherController")
const { authUser, authRole } = require("../middleware/auth")

// Teacher registration route
router.post("/register", authUser, authRole(["Owner", "Manager"]), teacherRegistration)

// Teacher login route
router.post("/login", teacherLogin)

// Get all teachers route
router.get("/", authUser, authRole(["Owner", "Manager", "Teacher", "Student"]), getAllTeachers)

// Get an teacher by id route
router.get("/:id", authUser, authRole(["Owner", "Manager"]), getTeacherById)

// Update an teacher route
router.put("/:id", authUser, authRole(["Owner", "Manager"]), updateTeacher)

// Delete an teacher route
router.delete("/:regNum/:id", authUser, authRole(["Owner", "Manager"]), deleteTeacher)

// Get teachers by search query
router.get("/search/:searchQuery", authUser, authRole(["Owner", "Manager"]), getTeachersBySearch)

// Get teacher by reg. num | Only for backend
router.get("/reg/:regNum", getTeacherByRegNum)

module.exports = router

// ---------------------------
// Developed by WAHSANDARUWAN
// ---------------------------