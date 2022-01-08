const express = require('express')
const router = express.Router()
const { subjectCreate, getAllSubjects, getSubjectById, updateSubject, deleteSubject, getSubjectsBySearch } = require("../controllers/subjectController")

// Subject create route
router.post("/create", subjectCreate)

// Get all subjects route
router.get("/", getAllSubjects)

// Get a subject by id route
router.get("/:id", getSubjectById)

// Update a subject route
router.put("/:id", updateSubject)

// Delete a subject route
router.delete("/:id", deleteSubject)

// Get subjects by search query
router.get("/search/:searchQuery", getSubjectsBySearch)

module.exports = router