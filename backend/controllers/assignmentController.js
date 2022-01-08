const Assignment = require("../models/assignmentModel")
const Class = require("../models/classModel")

// Assignment create
exports.assignmentCreate = async (req, res) => {
    const { title, description, date, link, visibility, teacherReg } = req.body

    // Check if title already exist
    const assignment = await Assignment.findOne({ title })
    if (assignment) {
        return res.json({ errors: { message: "Assignment title already exists!" } })
    }

    // Create a new assignment
    const newAssignment = new Assignment({
        title: title,
        description: description,
        date: date,
        link: link,
        visibility: visibility,
        teacherReg: teacherReg
    })

    try {
        await newAssignment.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Assignment!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}


// Get all assignments
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
        res.status(200).json(assignments)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get an assignment by id
exports.getAssignmentsById = async (req, res) => {
    const { id } = req.params

    try {
        const assignment = await Assignment.findById(id)
        res.status(200).json(assignment)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update an assignment
exports.updateAssignment = async (req, res) => {
    const { id } = req.params
    const { title, visibility } = req.body

    // Check if title already exist
    const assignment = await Assignment.findOne({ title })
    if (assignment) {
        if (assignment.id !== id) {
            return res.json({ errors: { message: "Assignment title already exists!" } })
        }
    }

    // Remove private assignments from the class
    if (visibility === "Private") {
        await Class.updateMany({ assignments: id }, { $pull: { assignments: id } })
    }

    try {
        await Assignment.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Assignment successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
    const { id } = req.params

    try {
        await Assignment.findByIdAndDelete(id)
        // Delete assignment from classes
        await Class.updateMany({ assignments: id }, { $pull: { assignments: id } })
        res.status(200).json({ created: true, success: { message: "Assignment successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get assignments by search query
exports.getAssignmentsBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const assignments = await Assignment.find({ $or: [{ title: regexQuery }, { description: regexQuery }, { date: regexQuery }, { visibility: regexQuery }] })
        res.status(200).json(assignments)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get an assignment by teacher reg code
exports.getAssignmentsByRegCode = async (req, res) => {
    const { regCode } = req.params

    try {
        const assignments = await Assignment.find({ $and: [{ teacherReg: regCode }, { visibility: "Public" }] })
        res.status(200).json(assignments)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}
