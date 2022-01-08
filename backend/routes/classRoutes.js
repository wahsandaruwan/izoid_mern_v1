const express = require('express')
const router = express.Router()
const { classCreate, getAllClasses, getClassById, updateClass, deleteClass, getClassesBySearch, assignStudents, deleteAssignedStudents, assignAssignments, deleteAssignedAssignments, assignMeetings, deleteAssignedMeetings, getClassesByStudentRegCode } = require("../controllers/classController")
const { authRole } = require("../middleware/auth")

// Class creation route
router.post("/create", authRole(["Owner", "Manager"]), classCreate)

// Get all classes route
router.get("/", authRole(["Owner", "Manager", "Teacher"]), getAllClasses)

// Get a class by id route
router.get("/:id", authRole(["Owner", "Manager", "Teacher", "Student"]), getClassById)

// Update a class route
router.put("/:id", authRole(["Owner", "Manager"]), updateClass)

// Delete a class route
router.delete("/:id", authRole(["Owner", "Manager"]), deleteClass)

// Get classes by search query route
router.get("/search/:searchQuery", authRole(["Owner", "Manager", "Teacher", "Student"]), getClassesBySearch)

// Update students array of a class route
router.put("/student/:id", authRole(["Owner", "Manager"]), assignStudents)

// Delete students assigned to a class route
router.put("/student/delete/:id", authRole(["Owner", "Manager"]), deleteAssignedStudents)

// Update assignments array of a class route
router.put("/assignments/:id", authRole(["Teacher"]), assignAssignments)

// Delete assignments assigned to a class route
router.put("/assignments/delete/:id", authRole(["Teacher"]), deleteAssignedAssignments)

// Update meetings array of a class route
router.put("/meetings/:id", authRole(["Teacher"]), assignMeetings)

// Delete meetings assigned to a class route
router.put("/meetings/delete/:id", authRole(["Teacher"]), deleteAssignedMeetings)

// Get classes by student reg code route
router.get("/student/:regCode", authRole(["Student"]), getClassesByStudentRegCode)

module.exports = router