const Class = require("../models/classModel")
const { validateRegNum } = require("../helpers/dataValidation")
const mongoose = require("mongoose")

// Class create
exports.classCreate = async (req, res) => {
    const { grade, subject, group, teacherReg } = req.body

    // Check teacher's reg code is valid
    if (!await validateRegNum(teacherReg, "Teacher")) {
        return res.json({ errors: { message: "Teacher's registration code is invalid!" } })
    }

    // Check current row already exist exist
    const currentRow = await Class.find({ $and: [{ grade }, { subject }, { group }, { teacherReg }] })
    if (currentRow.length > 0) {
        return res.json({ errors: { message: "This class is already exist!" } })
    }

    // Create a new class
    const newClass = new Class({
        grade: grade,
        subject: subject,
        group: group,
        teacherReg: teacherReg
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
        const classes = await Class.aggregate([
            {
                $lookup: {
                    from: "teachers",
                    localField: "teacherReg",
                    foreignField: "regNum",
                    as: "tcl"
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "students",
                    foreignField: "regNum",
                    as: "scl"
                }
            }
        ])
        res.status(200).json(classes)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a class by id
exports.getClassById = async (req, res) => {
    const { id } = req.params

    try {
        const cls = await Class.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "students",
                    foreignField: "regNum",
                    as: "scl"
                }
            },
            {
                $lookup: {
                    from: "assignments",
                    localField: "assignments",
                    foreignField: "_id",
                    as: "acl"
                }
            },
            {
                $lookup: {
                    from: "meetings",
                    localField: "meetings",
                    foreignField: "_id",
                    as: "mcl"
                }
            }
        ])
        res.status(200).json(cls)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a class
exports.updateClass = async (req, res) => {
    const { id } = req.params
    const { grade, subject, group, teacherReg } = req.body

    // Check teacher's reg num is valid
    if (!await validateRegNum(teacherReg, "Teacher")) {
        return res.json({ errors: { message: "Teacher's registration code is invalid!" } })
    }

    // Check current row already exist
    const currentRow = await Class.find({ $and: [{ grade }, { subject }, { group }, { teacherReg }] })
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
        const classes = await Class.aggregate([
            {
                $lookup: {
                    from: "teachers",
                    localField: "teacherReg",
                    foreignField: "regNum",
                    as: "tcl"
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "students",
                    foreignField: "regNum",
                    as: "scl"
                }
            },
            {
                $match: {
                    $or: [{ grade: regexQuery }, { subject: regexQuery }, { group: regexQuery }, { teacherReg: regexQuery }, { createdAt: regexQuery }, { students: regexQuery }]
                }
            }
        ])
        res.status(200).json(classes)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Assign students to the class
exports.assignStudents = async (req, res) => {
    const { id } = req.params
    const { studentReg } = req.body

    // Check student's reg code is empty
    if (studentReg === "") {
        return res.json({ errors: { message: "Enter a student's registration code!" } })
    }

    // Check student's reg code is valid
    if (!await validateRegNum(studentReg, "Student")) {
        return res.json({ errors: { message: "Student's registration code is invalid!" } })
    }

    // Check the student already exist
    const std = await Class.findOne({ $and: [{ _id: id }, { students: studentReg }] })
    if (std) {
        return res.json({ errors: { message: "Student is already exist in this class!" } })
    }

    try {
        await Class.findOneAndUpdate({ _id: id }, { $push: { students: studentReg } })
        res.status(200).json({ created: true, success: { message: "Successfully assigned a student!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete students from the class
exports.deleteAssignedStudents = async (req, res) => {
    const { id } = req.params
    const { studentReg } = req.body

    try {
        await Class.findOneAndUpdate({ _id: id }, { $pull: { students: studentReg } })
        res.status(200).json({ created: true, success: { message: "Successfully deleted an assigned student!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Assign assignments to the class
exports.assignAssignments = async (req, res) => {
    const { id } = req.params
    const { assignmentId } = req.body

    console.log(assignmentId)

    // Check assignment id is empty
    if (assignmentId === "") {
        return res.json({ errors: { message: "Enter the assignment title!" } })
    }

    // Check the assignment already exist
    const assignment = await Class.findOne({ $and: [{ _id: id }, { assignments: assignmentId }] })
    if (assignment) {
        return res.json({ errors: { message: "Assignment already assigned to this class!" } })
    }

    try {
        await Class.findOneAndUpdate({ _id: id }, { $push: { assignments: assignmentId } })
        res.status(200).json({ created: true, success: { message: "Successfully assigned an assignment!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete assignments from the class
exports.deleteAssignedAssignments = async (req, res) => {
    const { id } = req.params
    const { assignmentId } = req.body

    try {
        await Class.findOneAndUpdate({ _id: id }, { $pull: { assignments: assignmentId } })
        res.status(200).json({ created: true, success: { message: "Successfully deleted an assigned assignment!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Assign meetings to the class
exports.assignMeetings = async (req, res) => {
    const { id } = req.params
    const { meetingId } = req.body

    // Check meeting id is empty
    if (meetingId === "") {
        return res.json({ errors: { message: "Enter the meeting subject!" } })
    }

    // Check the meeting already exist
    const meeting = await Class.findOne({ $and: [{ _id: id }, { meetings: meetingId }] })
    if (meeting) {
        return res.json({ errors: { message: "Meeting already assigned to this class!" } })
    }

    try {
        await Class.findOneAndUpdate({ _id: id }, { $push: { meetings: meetingId } })
        res.status(200).json({ created: true, success: { message: "Successfully assigned a meeting!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete meetings from the class
exports.deleteAssignedMeetings = async (req, res) => {
    const { id } = req.params
    const { meetingId } = req.body

    try {
        await Class.findOneAndUpdate({ _id: id }, { $pull: { meetings: meetingId } })
        res.status(200).json({ created: true, success: { message: "Successfully deleted an assigned meeting!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get classes by student reg code
exports.getClassesByStudentRegCode = async (req, res) => {
    const { regCode } = req.params

    try {
        const classes = await Class.aggregate([
            {
                $lookup: {
                    from: "teachers",
                    localField: "teacherReg",
                    foreignField: "regNum",
                    as: "tcl"
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "students",
                    foreignField: "regNum",
                    as: "scl"
                }
            },
            {
                $match: { students: regCode }
            }
        ])
        res.status(200).json(classes)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}