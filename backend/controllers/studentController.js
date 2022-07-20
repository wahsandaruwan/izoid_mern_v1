const Student = require('../models/studentModel')
const Admin = require('../models/adminModel')
const Teacher = require('../models/teacherModel')
const Class = require('../models/classModel')
const bcrypt = require('bcrypt')
const { randomReg, randomJWT } = require('../helpers/randomGen')
const { sendEmail } = require('../helpers/sendEmail')

// Student registration
exports.studentRegistration = async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    homeAddress,
    schoolName,
    parentsName,
    parentsPhone,
    email,
    password,
  } = req.body
  let newPass = ''

  // Generate random reg number
  const regNum = randomReg('Student')

  // Check if reg num or email already exist
  const student = await Student.find({ $or: [{ email }, { regNum }] })
  if (student.length > 0) {
    if (student[0].email === email) {
      return res.json({ errors: { message: 'Email already exist!' } })
    } else if (student[0].regNum === regNum) {
      return res.json({
        errors: { message: 'Something went wrong try again!' },
      })
    }
  }

  // Check email exist in other collections
  const emailAdmin = await Admin.findOne({ email })
  const emailTeacher = await Teacher.findOne({ email })
  if (emailAdmin || emailTeacher) {
    return res.json({ errors: { message: 'Email already exist!' } })
  }

  // Password hashing
  const hashedPass = await bcrypt.hash(password, 8)

  // Set hashed password
  if (password.length < 6 && password.length > 0) {
    newPass = false
  } else if (password.length === 0) {
    newPass = ''
  } else {
    newPass = hashedPass
  }

  // Create a new student
  const newStudent = new Student({
    regNum: regNum,
    firstName: firstName,
    lastName: lastName,
    type: 'Student',
    gender: gender,
    dateOfBirth: dateOfBirth,
    homeAddress: homeAddress,
    schoolName: schoolName,
    parentsName: parentsName,
    parentsPhone: parentsPhone,
    email: email,
    password: newPass,
  })

  try {
    await newStudent.save()
    // Send email to new student
    sendEmail(
      email,
      regNum,
      `Your Izoid Student account has been successfully created!`,
      password,
    )
    res.status(200).json({
      created: true,
      success: { message: `Successfully created a new Student!` },
    })
  } catch (err) {
    res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
  }
}

// Student login
exports.studentLogin = async (req, res) => {
  const { type, email, password } = req.body

  // Check if reg num already exists
  const student = await Student.findOne({ email })
  if (!student) {
    return res.json({ errors: { message: 'Wrong email address!' } })
  }

  // Check if password matches
  const passOk = await bcrypt.compare(password, student.password)
  if (!passOk) {
    return res.json({ errors: { message: 'Wrong password!' } })
  }

  // Confirm the type
  if (!type === 'Student') {
    return res.json({ errors: { message: 'Wrong user type!' } })
  }

  // Generate jwt
  const jwt = randomJWT(student)
  res.status(200).json({
    auth: true,
    token: jwt,
    regNum: student.regNum,
    firstName: student.firstName,
    type: student.type,
  })
}

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
    res.status(200).json(students)
  } catch (err) {
    res.json({ errors: { message: err.message } })
  }
}

// Get a student by id
exports.getStudentById = async (req, res) => {
  const { id } = req.params

  try {
    const student = await Student.findById(id)
    res.status(200).json(student)
  } catch (err) {
    res.json({ errors: { message: err.message } })
  }
}

// Update a student
exports.updateStudent = async (req, res) => {
  const { id } = req.params
  const { email, password } = req.body
  let updatedPass = ''

  // Get existing admin password by Id
  const studentById = await Student.findOne({ _id: id })
  if (studentById) {
    if (!password) {
      req.body.password = studentById.password
    } else {
      updatedPass = password

      // Password hashing
      const hashedPass = await bcrypt.hash(password, 8)

      // Set hashed password
      req.body.password = password.length >= 6 ? hashedPass : false
    }
  }

  // Check email already exists
  const studentByEmail = await Student.findOne({ email })
  if (studentByEmail) {
    if (studentByEmail.id !== id) {
      return res.json({ errors: { message: 'Email already exist!' } })
    }
  }

  // Check email exist in other collections
  const emailAdmin = await Admin.findOne({ email })
  const emailTeacher = await Teacher.findOne({ email })
  if (emailAdmin || emailTeacher) {
    return res.json({ errors: { message: 'Email already existttt!' } })
  }

  try {
    await Student.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    })
    // Send email to student
    if (updatedPass) {
      sendEmail(
        email,
        studentById.regNum,
        `Your Izoid Student account password has been updated!`,
        password,
      )
    }
    res.status(200).json({
      created: true,
      success: { message: 'Student successfully updated!' },
    })
  } catch (err) {
    res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
  }
}

// Delete a student
exports.deleteStudent = async (req, res) => {
  const { regNum, id } = req.params

  try {
    await Student.findByIdAndDelete(id)
    // Delete student from classes
    await Class.updateMany(
      { students: regNum },
      { $pull: { students: regNum } },
    )
    res.status(200).json({
      created: true,
      success: { message: 'Student successfully deleted!' },
    })
  } catch (err) {
    res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
  }
}

// Get students by search query
exports.getStudentsBySearch = async (req, res) => {
  const { searchQuery } = req.params

  try {
    const regexQuery = new RegExp(searchQuery, 'i')
    const students = await Student.find({
      $or: [
        { regNum: regexQuery },
        { firstName: regexQuery },
        { lastName: regexQuery },
        { email: regexQuery },
        { dateOfBirth: regexQuery },
        { homeAddress: regexQuery },
        { parentsName: regexQuery },
        { parentsPhone: regexQuery },
        { createdAt: regexQuery },
      ],
    })
    res.status(200).json(students)
  } catch (err) {
    res.json({ errors: { message: err.message } })
  }
}

// Get a student by reg num | Only for backend
exports.getStudentByRegNum = async (req, res) => {
  const { regNum } = req.params

  try {
    const student = await Student.findOne({ regNum })
    if (student) {
      res.send(true)
    } else {
      res.send(false)
    }
  } catch (err) {
    res.send(err.message)
  }
}
