const express = require('express')
const router = express.Router()
const { subjectCreate, getAllSubjects, getSubjectById, updateSubject, deleteSubject, getSubjectsBySearch } = require("../controllers/subjectController")
const { authUser } = require("../middleware/auth")

// Subject create route
router.post("/create", authUser, subjectCreate)

// Get all subjects route
router.get("/", authUser, getAllSubjects)

// Get a subject by id route
router.get("/:id", authUser, getSubjectById)

// Update a subject route
router.put("/:id", authUser, updateSubject)

// Delete a subject route
router.delete("/:id", authUser, deleteSubject)

// Get subjects by search query
router.get("/search/:searchQuery", authUser, getSubjectsBySearch)

module.exports = router