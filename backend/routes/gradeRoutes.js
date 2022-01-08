const express = require('express')
const router = express.Router()
const { gradeCreate, getAllGrades, getGradeById, updateGrade, deleteGrade, getGradesBySearch } = require("../controllers/gradeController")
const { authRole } = require("../middleware/auth")

// Grade create route
router.post("/create", authRole(["Owner", "Manager"]), gradeCreate)

// Get all grades route
router.get("/", authRole(["Owner", "Manager", "Teacher", "Student"]), getAllGrades)

// Get a grade by id route
router.get("/:id", getGradeById)

// Update a grade route
router.put("/:id", updateGrade)

// Delete a grade route
router.delete("/:id", deleteGrade)

// Get grades by search query
router.get("/search/:searchQuery", getGradesBySearch)

module.exports = router