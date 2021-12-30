const express = require('express')
const router = express.Router()
const { teacherRegistration, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, getTeachersBySearch } = require("../controllers/teacherController")
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

module.exports = router