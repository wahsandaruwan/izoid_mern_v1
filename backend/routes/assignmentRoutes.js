const express = require('express')
const router = express.Router()
const { assignmentCreate, getAllAssignments, getAssignmentsById, updateAssignment, deleteAssignment, getAssignmentsBySearch, getAssignmentsByRegCode } = require("../controllers/assignmentController")
const { authRole } = require("../middleware/auth")

// Assignment creation route
router.post("/create", authRole(["Teacher"]), assignmentCreate)

// Get all assignments route
router.get("/", authRole(["Teacher"]), getAllAssignments)

// Get an assignment by id route
router.get("/:id", authRole(["Teacher"]), getAssignmentsById)

// Update an assignment route
router.put("/:id", authRole(["Teacher"]), updateAssignment)

// Delete an assignment route
router.delete("/:id", authRole(["Teacher"]), deleteAssignment)

// Get assignment by search query
router.get("/search/:searchQuery", authRole(["Teacher"]), getAssignmentsBySearch)

// Get an assignment by teacher reg code route
router.get("/reg/:regCode", authRole(["Owner", "Manager", "Teacher", "Student"]), getAssignmentsByRegCode)

module.exports = router