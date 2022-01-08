const express = require('express')
const router = express.Router()
const { meetingCreate, getAllMeetings, getMeetingById, updateMeeting, deleteMeeting, getMeetingsBySearch, getMeetingsByRegCode } = require("../controllers/meetingController")
const { authRole } = require("../middleware/auth")

// Meeting creation route
router.post("/create", authRole(["Teacher"]), meetingCreate)

// Get all meetings route
router.get("/", authRole(["Teacher"]), getAllMeetings)

// Get a meeting by id route
router.get("/:id", authRole(["Teacher"]), getMeetingById)

// Update a meeting route
router.put("/:id", authRole(["Teacher"]), updateMeeting)

// Delete a meeting route
router.delete("/:id", authRole(["Teacher"]), deleteMeeting)

// Get meeting by search query
router.get("/search/:searchQuery", authRole(["Teacher"]), getMeetingsBySearch)

// Get a meeting by teacher reg code route
router.get("/reg/:regCode", authRole(["Owner", "Manager", "Teacher", "Student"]), getMeetingsByRegCode)

module.exports = router