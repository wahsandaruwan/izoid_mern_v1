const express = require('express')
const router = express.Router()
const { studentRegistration, studentLogin, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentsBySearch, getStudentByRegNum } = require("../controllers/studentController")
const { authUser, authRole } = require("../middleware/auth")

// Student registration route
router.post("/register", authUser, authRole(["Owner", "Manager"]), studentRegistration)

// Student login route
router.post("/login", studentLogin)

// Get all students route
router.get("/", authUser, authRole(["Owner", "Manager", "Teacher", "Student"]), getAllStudents)

// Get a student by id route
router.get("/:id", authUser, authRole(["Owner", "Manager"]), getStudentById)

// Update a student route
router.put("/:id", authUser, authRole(["Owner", "Manager"]), updateStudent)

// Delete a student route
router.delete("/:regNum/:id", authUser, authRole(["Owner", "Manager"]), deleteStudent)

// Get students by search query
router.get("/search/:searchQuery", authUser, authRole(["Owner", "Manager"]), getStudentsBySearch)

// Get student by reg. num | Only for backend
router.get("/reg/:regNum", getStudentByRegNum)

module.exports = router