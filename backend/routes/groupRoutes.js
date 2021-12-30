const express = require('express')
const router = express.Router()
const { groupCreate, getAllGroups, getGroupById, updateGroup, deleteGroup, getGroupsBySearch } = require("../controllers/groupController")
const { authUser } = require("../middleware/auth")

// Group create route
router.post("/create", authUser, groupCreate)

// Get all groups route
router.get("/", authUser, getAllGroups)

// Get a group by id route
router.get("/:id", authUser, getGroupById)

// Update a group route
router.put("/:id", authUser, updateGroup)

// Delete a group route
router.delete("/:id", authUser, deleteGroup)

// Get groups by search query
router.get("/search/:searchQuery", authUser, getGroupsBySearch)

module.exports = router