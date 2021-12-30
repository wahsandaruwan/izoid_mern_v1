const Group = require("../models/groupModel")

// Group create
exports.groupCreate = async (req, res) => {
    const { name } = req.body

    // Check if group name already exist
    const group = await Group.findOne({ name })
    if (group) {
        return res.json({ errors: { message: "Group already exist!" } })
    }

    // Create a new group
    const newGroup = new Group({
        name: name
    })

    try {
        await newGroup.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Group!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get all groups
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find()
        res.status(200).json(groups)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a group by id
exports.getGroupById = async (req, res) => {
    const { id } = req.params

    try {
        const group = await Group.findById(id)
        res.status(200).json(group)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a group
exports.updateGroup = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    // Check if group name already exists
    const groupByName = await Group.findOne({ name })
    if (groupByName) {
        if (groupByName.id !== id) {
            return res.json({ errors: { message: "Group already exist!" } })
        }
    }

    try {
        await Group.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Group successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a group
exports.deleteGroup = async (req, res) => {
    const { id } = req.params

    try {
        await Group.findByIdAndDelete(id)
        res.status(200).json({ created: true, success: { message: "Group successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get groups by search query
exports.getGroupsBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const groups = await Group.find({ name: regexQuery })
        res.status(200).json(groups)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}