const Meeting = require("../models/meetingModel")
const Class = require("../models/classModel")

// Meeting create
exports.meetingCreate = async (req, res) => {
    const { subject, description, date, time, link, visibility, teacherReg } = req.body

    // Check if subject already exist
    const meeting = await Meeting.findOne({ subject })
    if (meeting) {
        return res.json({ errors: { message: "Meeting subject already exists!" } })
    }

    // Create a new meeting
    const newMeeting = new Meeting({
        subject: subject,
        description: description,
        date: date,
        time: time,
        link: link,
        visibility: visibility,
        teacherReg: teacherReg
    })

    try {
        await newMeeting.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Meeting!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}


// Get all meetings
exports.getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find()
        res.status(200).json(meetings)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a meeting by id
exports.getMeetingById = async (req, res) => {
    const { id } = req.params

    try {
        const meeting = await Meeting.findById(id)
        res.status(200).json(meeting)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a meeting
exports.updateMeeting = async (req, res) => {
    const { id } = req.params
    const { subject, visibility } = req.body

    // Check if subject already exist
    const meeting = await Meeting.findOne({ subject })
    if (meeting) {
        if (meeting.id !== id) {
            return res.json({ errors: { message: "Meeting subject already exists!" } })
        }
    }

    // Remove private meetings from the class
    if (visibility === "Private") {
        await Class.updateMany({ meetings: id }, { $pull: { meetings: id } })
    }

    try {
        await Meeting.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Meeting successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a meeting
exports.deleteMeeting = async (req, res) => {
    const { id } = req.params

    try {
        await Meeting.findByIdAndDelete(id)
        // Delete meeting from classes
        await Class.updateMany({ meetings: id }, { $pull: { meetings: id } })
        res.status(200).json({ created: true, success: { message: "Meeting successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get meetings by search query
exports.getMeetingsBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const meetings = await Meeting.find({ $or: [{ subject: regexQuery }, { description: regexQuery }, { date: regexQuery }, { time: regexQuery }, { visibility: regexQuery }] })
        res.status(200).json(meetings)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a meeting by teacher reg code
exports.getMeetingsByRegCode = async (req, res) => {
    const { regCode } = req.params

    try {
        const meetings = await Meeting.find({ $and: [{ teacherReg: regCode }, { visibility: "Public" }] })
        res.status(200).json(meetings)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}
