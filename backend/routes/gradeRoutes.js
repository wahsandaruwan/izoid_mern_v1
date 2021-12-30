const express = require('express')
const router = express.Router()
const { gradeCreate, getAllGrades, getGradeById, updateGrade, deleteGrade, getGradesBySearch } = require("../controllers/gradeController")
const { authUser } = require("../middleware/auth")

// Grade create route
router.post("/create", authUser, gradeCreate)

// Get all grades route
router.get("/", authUser, getAllGrades)

// Get a grade by id route
router.get("/:id", authUser, getGradeById)

// Update a grade route
router.put("/:id", authUser, updateGrade)

// Delete a grade route
router.delete("/:id", authUser, deleteGrade)

// Get grades by search query
router.get("/search/:searchQuery", authUser, getGradesBySearch)

module.exports = router