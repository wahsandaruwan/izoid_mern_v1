const Combination = require("../models/combinationModel")
const { validateRegNum } = require("../helpers/dataValidation");

// Combination create
exports.combinationCreate = async (req, res) => {
    const { grade, subject, group, teacherReg, studentReg } = req.body

    // Check teacher's reg num is valid
    if (!await validateRegNum(teacherReg, "Teacher")) {
        return res.json({ errors: { message: "Teacher's registration code is invalid!" } })
    }

    // Check student's reg num is valid
    if (!await validateRegNum(studentReg, "Student")) {
        return res.json({ errors: { message: "Student's registration code is invalid!" } })
    }

    // Check current row already exist exist
    const currentRow = await Combination.find({ $and: [{ grade }, { subject }, { group }, { teacherReg }, { studentReg }] })
    if (currentRow.length > 0) {
        return res.json({ errors: { message: "This combination already exist!" } })
    }

    // Create a new combination
    const newCombination = new Combination({
        grade: grade,
        subject: subject,
        group: group,
        teacherReg: teacherReg,
        studentReg: studentReg
    })

    try {
        await newCombination.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Combination!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get all combinations
exports.getAllCombinations = async (req, res) => {
    try {
        const combinations = await Combination.find()
        res.status(200).json(combinations)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a combination by id
exports.getCombinationById = async (req, res) => {
    const { id } = req.params

    try {
        const combination = await Combination.findById(id)
        res.status(200).json(combination)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a combination
exports.updateCombination = async (req, res) => {
    const { id } = req.params
    const { grade, subject, group, teacherReg, studentReg } = req.body

    // Check teacher's reg num is valid
    if (!await validateRegNum(teacherReg, "Teacher")) {
        return res.json({ errors: { message: "Teacher's registration code is invalid!" } })
    }

    // Check student's reg num is valid
    if (!await validateRegNum(studentReg, "Student")) {
        return res.json({ errors: { message: "Student's registration code is invalid!" } })
    }

    // Check current row already exist exist
    const currentRow = await Combination.find({ $and: [{ grade }, { subject }, { group }, { teacherReg }, { studentReg }] })
    console.log(currentRow)
    if (currentRow.length > 0) {
        if (currentRow[0].id !== id) {
            return res.json({ errors: { message: "This combination already exist!" } })
        }
    }

    try {
        await Combination.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Combination successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a combination
exports.deleteCombination = async (req, res) => {
    const { id } = req.params

    try {
        await Combination.findByIdAndDelete(id)
        res.status(200).json({ created: true, success: { message: "Combination successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get combinations by search query
exports.getCombinationsBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const combinations = await Combination.find({ $or: [{ grade: regexQuery }, { subject: regexQuery }, { group: regexQuery }, { teacherReg: regexQuery }, { studentReg: regexQuery }] })
        res.status(200).json(combinations)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}