const express = require('express')
const router = express.Router()
const { combinationCreate, getAllCombinations, getCombinationById, updateCombination, deleteCombination, getCombinationsBySearch } = require("../controllers/combinationController")
const { authUser } = require("../middleware/auth")

// Combination registration route
router.post("/create", authUser, combinationCreate)

// Get all combinations route
router.get("/", authUser, getAllCombinations)

// Get a combination by id route
router.get("/:id", authUser, getCombinationById)

// Update a combination route
router.put("/:id", authUser, updateCombination)

// Delete a combination route
router.delete("/:id", authUser, deleteCombination)

// Get combinations by search query
router.get("/search/:searchQuery", authUser, getCombinationsBySearch)

module.exports = router