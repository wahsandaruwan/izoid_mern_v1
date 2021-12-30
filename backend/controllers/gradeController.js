const Grade = require("../models/subjectModel")

// Grade create
exports.gradeCreate = async (req, res) => {
    const { name } = req.body

    // Check if grade name already exist
    const grade = await Grade.findOne({ name })
    if (grade) {
        return res.json({ errors: { message: "Grade already exist!" } })
    }

    // Create a new grade
    const newGrade = new Grade({
        name: name
    })

    try {
        await newGrade.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Grade!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get all grades
exports.getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.find()
        res.status(200).json(grades)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a grade by id
exports.getGradeById = async (req, res) => {
    const { id } = req.params

    try {
        const grade = await Grade.findById(id)
        res.status(200).json(grade)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a grade
exports.updateGrade = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    // Check if grade name already exists
    const gradeByName = await Grade.findOne({ name })
    if (gradeByName) {
        if (gradeByName.id !== id) {
            return res.json({ errors: { message: "Grade already exist!" } })
        }
    }

    try {
        await Grade.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Grade successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a grade
exports.deleteGrade = async (req, res) => {
    const { id } = req.params

    try {
        await Grade.findByIdAndDelete(id)
        res.status(200).json({ created: true, success: { message: "Grade successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get grades by search query
exports.getGradesBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const grades = await Grade.find({ name: regexQuery })
        res.status(200).json(grades)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}