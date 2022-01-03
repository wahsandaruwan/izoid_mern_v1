const Class = require("../models/classModel")
const { validateRegNum } = require("../helpers/dataValidation");

// Class create
exports.classCreate = async (req, res) => {
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
    const currentRow = await Class.find({ $and: [{ grade }, { subject }, { group }, { teacherReg }, { studentReg }] })
    if (currentRow.length > 0) {
        return res.json({ errors: { message: "This class is already exist!" } })
    }

    // Create a new class
    const newClass = new Class({
        grade: grade,
        subject: subject,
        group: group,
        teacherReg: teacherReg,
        studentReg: studentReg
    })

    try {
        await newClass.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Class!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find()
        res.status(200).json(classes)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a class by id
exports.getClassById = async (req, res) => {
    const { id } = req.params

    try {
        const cls = await Class.findById(id)
        res.status(200).json(cls)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a class
exports.updateClass = async (req, res) => {
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
    const currentRow = await Class.find({ $and: [{ grade }, { subject }, { group }, { teacherReg }, { studentReg }] })
    console.log(currentRow)
    if (currentRow.length > 0) {
        if (currentRow[0].id !== id) {
            return res.json({ errors: { message: "This class is already exist!" } })
        }
    }

    try {
        await Class.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Class successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a class
exports.deleteClass = async (req, res) => {
    const { id } = req.params

    try {
        await Class.findByIdAndDelete(id)
        res.status(200).json({ created: true, success: { message: "Class successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get classes by search query
exports.getClassesBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const classes = await Class.find({ $or: [{ grade: regexQuery }, { subject: regexQuery }, { group: regexQuery }, { teacherReg: regexQuery }, { studentReg: regexQuery }] })
        res.status(200).json(classes)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}