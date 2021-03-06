import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import Loader from "../Elements/Loader"

const Students = () => {
    // Student data states
    const [students, setStudents] = useState("")
    const [studentId, setStudentId] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dob, setDob] = useState("")
    const [gender, setGender] = useState("")
    const [homeAddress, setHomeAddress] = useState("")
    const [schoolName, setSchoolName] = useState("")
    const [parentsName, setParentsName] = useState("")
    const [parentsPhone, setParentsPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Loading state
    const [loading, setLoading] = useState(true)

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    let jwt = ""
    if (userLoginData) {
        const { token } = JSON.parse(userLoginData)
        jwt = token
    }

    // Api request configurations
    const configCommon = {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }

    const configPost = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    }

    // Set history
    const history = useHistory()

    // Update states
    const firstNameState = (newVal) => {
        setError("")
        setSuccess("")
        setFirstName(newVal)
    }

    const lastNameState = (newVal) => {
        setError("")
        setSuccess("")
        setLastName(newVal)
    }

    const dobState = (newVal) => {
        setError("")
        setSuccess("")
        setDob(newVal)
    }

    const genderState = (newVal) => {
        setError("")
        setSuccess("")
        setGender(newVal)
    }

    const homeAddressState = (newVal) => {
        setError("")
        setSuccess("")
        setHomeAddress(newVal)
    }

    const schoolNameState = (newVal) => {
        setError("")
        setSuccess("")
        setSchoolName(newVal)
    }

    const parentsNameState = (newVal) => {
        setError("")
        setSuccess("")
        setParentsName(newVal)
    }

    const parentsPhoneState = (newVal) => {
        setError("")
        setSuccess("")
        setParentsPhone(newVal)
    }

    const emailState = (newVal) => {
        setError("")
        setSuccess("")
        setEmail(newVal)
    }

    const passwordState = (newVal) => {
        setError("")
        setSuccess("")
        setPassword(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setFirstName("")
        setLastName("")
        setDob("")
        setGender("")
        setHomeAddress("")
        setSchoolName("")
        setParentsName("")
        setParentsPhone("")
        setEmail("")
        setPassword("")

        // Clear selected student id
        setStudentId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        studentsFetchHandler()
    }

    // Students fetch handler
    const studentsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}students/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setStudents(data)
                setLoading(false)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all students
    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            studentsFetchHandler()
        }
        return () => { isMounted = false }
    }, [])

    // Create student handler
    const studentCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_PREFIX}students/register`, {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dob,
                gender: gender,
                homeAddress: homeAddress,
                schoolName: schoolName,
                parentsName: parentsName,
                parentsPhone: parentsPhone,
                email: email,
                password: password
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                studentsFetchHandler()

                // Clear all
                clearAll(e)
            }
            else {
                if (data.authEx) {
                    setSuccess("")
                    setError(data.errors.message)

                    setTimeout(() => {
                        // Clear local storage
                        localStorage.clear()
                        history.push("/")
                    }, 5000)
                }
                else {
                    throw Error(data.errors.message)
                }
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Get a student by id handler
    const oneStudentFetchHandler = async (studentId) => {
        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}students/${studentId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setFirstName(data.firstName)
                setLastName(data.lastName)
                setDob(data.dateOfBirth)
                setGender(data.gender)
                setHomeAddress(data.homeAddress)
                setSchoolName(data.schoolName)
                setParentsName(data.parentsName)
                setParentsPhone(data.parentsPhone)
                setEmail(data.email)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update a student handler
    const studentUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}students/${studentId}`, {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dob,
                gender: gender,
                homeAddress: homeAddress,
                schoolName: schoolName,
                parentsName: parentsName,
                parentsPhone: parentsPhone,
                email: email,
                password: password
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                studentsFetchHandler()

                // Clear all
                clearAll(e)
            }
            else {
                if (data.authEx) {
                    setSuccess("")
                    setError(data.errors.message)

                    setTimeout(() => {
                        // Clear local storage
                        localStorage.clear()
                        history.push("/")
                    }, 5000)
                }
                else {
                    throw Error(data.errors.message)
                }
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Delete a student handler
    const studentDeleteHandler = async (e, studentId, regNum) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this student?")) {
            // Api call
            try {
                const { data } = await axios.delete(`${process.env.REACT_APP_API_PREFIX}students/${regNum}/${studentId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    studentsFetchHandler()
                }
                else {
                    if (data.authEx) {
                        alert(data.errors.message)

                        // Clear local storage
                        localStorage.clear()
                        history.push("/")
                    }
                    else {
                        throw Error(data.errors.message)
                    }
                }
            } catch (err) {
                alert(err.message)
            }
        }
    }

    // Search a student by a query handler
    const studentSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}students/search/${query}`, configCommon)
                setStudents(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            studentsFetchHandler()
        }
    }

    console.log(new Date().toISOString().split("T")[0])

    return (
        <>
            <div className="data-content">
                {
                    loading ? (
                        <Loader />
                    ) : (
                        <div>
                            <div className="data-form">
                                <h2>Manage Students</h2>
                                <form>
                                    <div className="inputs">
                                        <InputBox placeText="First Name" defaultValue={firstName} type="text" inputState={firstNameState} />
                                        <InputBox placeText="Last Name" defaultValue={lastName} type="text" inputState={lastNameState} />
                                        <div className="date">
                                            <label className="date-text" htmlFor="date_picker">Date of Birth</label>
                                            <input type="date" id="date_picker" max={new Date().toISOString().split("T")[0]} className="date-picker" value={dob} onChange={(e) => dobState(e.target.value)} />
                                        </div>
                                        <div className="select-box">
                                            <label className="drop-text" htmlFor="drop-gender1">Gender</label>
                                            <select id="drop-gender1" value={gender} className="frm-drop" onChange={(e) => genderState(e.target.value)}>
                                                <option value=""></option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <textarea className="textarea-box" placeholder="Home Address" value={homeAddress} type="text" onChange={(e) => homeAddressState(e.target.value)}></textarea>
                                        <InputBox placeText="School Name" defaultValue={schoolName} type="text" inputState={schoolNameState} />
                                        <InputBox placeText="Parent's Name" defaultValue={parentsName} type="text" inputState={parentsNameState} />
                                        <InputBox placeText="Parent's Phone" defaultValue={parentsPhone} type="text" inputState={parentsPhoneState} />
                                        <InputBox placeText="Email" defaultValue={email} type="text" inputState={emailState} />
                                        <InputBox placeText={!studentId ? "Password" : "New Password (Leave it empty to keep it unchanged)"} defaultValue={password} type="password" inputState={passwordState} />
                                    </div>
                                    <SubmitBtn clickFunc={!studentId ? studentCreateHandler : studentUpdateHandler} text={!studentId ? "Add a Student" : "Update a Student"} />
                                    <a className="clear-btn" onClick={(e) => clearAll(e)}>Clear All</a>
                                    {error &&
                                        <div className="msg err">{error}</div>
                                    }
                                    {success &&
                                        <div className="msg success">{success}</div>
                                    }
                                </form>
                            </div>
                            <div className="data-table">
                                <div>
                                    <div className="search-sec">
                                        <InputBox placeText="Search Students..." inputState={studentSearchHandler} />
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Registration Code</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Gender</th>
                                                <th>Date of Birth</th>
                                                <th>Home Address</th>
                                                <th>School Name</th>
                                                <th>Parent's Name</th>
                                                <th>Parent's Phone</th>
                                                <th>Email</th>
                                                <th>Creation Date</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                students.length > 0 && (
                                                    students.map((obj, index) => {
                                                        const { _id, regNum, firstName, lastName, gender, dateOfBirth, homeAddress, schoolName, parentsName, parentsPhone, email, createdAt } = obj
                                                        return (
                                                            <tr key={_id}>
                                                                <td>{index + 1}</td>
                                                                <td>{regNum}</td>
                                                                <td>{firstName}</td>
                                                                <td>{lastName}</td>
                                                                <td>{gender}</td>
                                                                <td>{dateOfBirth}</td>
                                                                <td>{homeAddress}</td>
                                                                <td>{schoolName}</td>
                                                                <td>{parentsName}</td>
                                                                <td>{parentsPhone}</td>
                                                                <td>{email}</td>
                                                                <td>{createdAt}</td>
                                                                <td className="td-btn td-edit"><a onClick={(e) => {
                                                                    setStudentId(_id)
                                                                    oneStudentFetchHandler(_id)
                                                                }}>Edit</a></td>
                                                                <td className="td-btn td-del"><a onClick={(e) => studentDeleteHandler(e, _id, regNum)}>Delete</a></td>
                                                            </tr>
                                                        )
                                                    })
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Students
