const express = require('express')
const router = express.Router()
const { groupCreate, getAllGroups, getGroupById, updateGroup, deleteGroup, getGroupsBySearch } = require("../controllers/groupController")

// Group create route
router.post("/create", groupCreate)

// Get all groups route
router.get("/", getAllGroups)

// Get a group by id route
router.get("/:id", getGroupById)

// Update a group route
router.put("/:id", updateGroup)

// Delete a group route
router.delete("/:id", deleteGroup)

// Get groups by search query
router.get("/search/:searchQuery", getGroupsBySearch)

module.exports = router