const express = require('express')
const router = express.Router()
const { classCreate, getAllClasses, getClassById, updateClass, deleteClass, getClassesBySearch } = require("../controllers/classController")
const { authUser } = require("../middleware/auth")

// Class creation route
router.post("/create", authUser, classCreate)

// Get all classes route
router.get("/", authUser, getAllClasses)

// Get a class by id route
router.get("/:id", authUser, getClassById)

// Update a class route
router.put("/:id", authUser, updateClass)

// Delete a class route
router.delete("/:id", authUser, deleteClass)

// Get classes by search query
router.get("/search/:searchQuery", authUser, getClassesBySearch)

module.exports = router