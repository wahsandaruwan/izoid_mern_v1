const Subject = require("../models/subjectModel")
const bcrypt = require("bcrypt")

// Subject create
exports.subjectCreate = async (req, res) => {
    const { name } = req.body

    // Check if subject name already exist
    const subject = await Subject.findOne({ name })
    if (subject) {
        return res.json({ errors: { message: "Subject already exist!" } })
    }

    // Create a new subject
    const newSubject = new Subject({
        name: name
    })

    try {
        await newSubject.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Subject!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get all subject
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
        res.status(200).json(subjects)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a subject by id
exports.getSubjectById = async (req, res) => {
    const { id } = req.params

    try {
        const subject = await Subject.findById(id)
        res.status(200).json(subject)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a subject
exports.updateSubject = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    // Check if subject name already exists
    const subjectByName = await Subject.findOne({ name })
    if (subjectByName) {
        if (subjectByName.id !== id) {
            return res.json({ errors: { message: "Subject already exist!" } })
        }
    }

    try {
        await Subject.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Subject successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a subject
exports.deleteSubject = async (req, res) => {
    const { id } = req.params

    try {
        await Subject.findByIdAndDelete(id)
        res.status(200).json({ created: true, success: { message: "Subject successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get subjects by search query
exports.getSubjectsBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const subjects = await Subject.find({ name: regexQuery })
        res.status(200).json(subjects)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}