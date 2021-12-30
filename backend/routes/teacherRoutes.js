const express = require('express')
const router = express.Router()
const { teacherRegistration, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, getTeachersBySearch, getTeacherByRegNum } = require("../controllers/teacherController")
const { authUser } = require("../middleware/auth")

// Teacher registration route
router.post("/register", authUser, teacherRegistration)

// Get all teachers route
router.get("/", authUser, getAllTeachers)

// Get an teacher by id route
router.get("/:id", authUser, getTeacherById)

// Update an teacher route
router.put("/:id", authUser, updateTeacher)

// Delete an teacher route
router.delete("/:id", authUser, deleteTeacher)

// Get teachers by search query
router.get("/search/:searchQuery", authUser, getTeachersBySearch)

// Get teacher by reg. num | Only for backend
router.get("/reg/:regNum", getTeacherByRegNum)

module.exports = router