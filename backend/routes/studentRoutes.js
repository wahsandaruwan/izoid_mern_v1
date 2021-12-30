const express = require('express')
const router = express.Router()
const { studentRegistration, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentsBySearch, getStudentByRegNum } = require("../controllers/studentController")
const { authUser } = require("../middleware/auth")

// Student registration route
router.post("/register", authUser, studentRegistration)

// Get all students route
router.get("/", authUser, getAllStudents)

// Get a student by id route
router.get("/:id", authUser, getStudentById)

// Update a student route
router.put("/:id", authUser, updateStudent)

// Delete a student route
router.delete("/:id", authUser, deleteStudent)

// Get students by search query
router.get("/search/:searchQuery", authUser, getStudentsBySearch)

// Get student by reg. num | Only for backend
router.get("/reg/:regNum", getStudentByRegNum)

module.exports = router