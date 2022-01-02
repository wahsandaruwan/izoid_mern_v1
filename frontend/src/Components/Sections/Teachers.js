import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Teachers = () => {
    // Teacher data states
    const [teachers, setTeachers] = useState("")
    const [teacherId, setTeacherId] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

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

    const phoneState = (newVal) => {
        setError("")
        setSuccess("")
        setPhone(newVal)
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
        setPhone("")
        setEmail("")
        setPassword("")

        // Clear selected teacher id
        setTeacherId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        teachersFetchHandler()
    }

    // Teachers fetch handler
    const teachersFetchHandler = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3300/api/teachers/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setTeachers(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all teachers
    useEffect(() => {
        teachersFetchHandler()
    }, [])

    // Create teacher handler
    const teacherCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`http://localhost:3300/api/teachers/register`, {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                password: password
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                teachersFetchHandler()

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

    // Get a teacher by id handler
    const oneTeacherFetchHandler = async (adminId) => {
        // Api call
        try {
            const { data } = await axios.get(`http://localhost:3300/api/teachers/${adminId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setFirstName(data.firstName)
                setLastName(data.lastName)
                setPhone(data.phone)
                setEmail(data.email)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update a teacher handler
    const teacherUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`http://localhost:3300/api/teachers/${teacherId}`, {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                password: password
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                teachersFetchHandler()

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

    // Delete a teacher handler
    const teacherDeleteHandler = async (e, teacherId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this teacher?")) {
            // Api call
            try {
                const { data } = await axios.delete(`http://localhost:3300/api/teachers/${teacherId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    teachersFetchHandler()
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

    // Search a teacher by a query handler
    const teacherSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`http://localhost:3300/api/teachers/search/${query}`, configCommon)
                setTeachers(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            teachersFetchHandler()
        }
    }

    return (
        <>
            <div className="data-content">
                <div>
                    <div className="data-form">
                        <h2>Manage Teachers</h2>
                        <form>
                            <InputBox placeText="First Name" defaultValue={firstName} type="text" inputState={firstNameState} />
                            <InputBox placeText="Last Name" defaultValue={lastName} type="text" inputState={lastNameState} />
                            <InputBox placeText="Phone" defaultValue={phone} type="text" inputState={phoneState} />
                            <InputBox placeText="Email" defaultValue={email} type="text" inputState={emailState} />
                            <InputBox placeText={!teacherId ? "Password" : "New Password (Leave it empty to keep it unchanged)"} defaultValue={password} type="password" inputState={passwordState} />
                            <SubmitBtn clickFunc={!teacherId ? teacherCreateHandler : teacherUpdateHandler} text={!teacherId ? "Add a Teacher" : "Update a Teacher"} />
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
                                <InputBox placeText="Search Teachers..." inputState={teacherSearchHandler} />
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Registration Code</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        teachers.length > 0 && (
                                            teachers.map((obj, index) => {
                                                const { _id, regNum, firstName, lastName, phone, email } = obj
                                                return (
                                                    <tr key={_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{regNum}</td>
                                                        <td>{firstName}</td>
                                                        <td>{lastName}</td>
                                                        <td>{phone}</td>
                                                        <td>{email}</td>
                                                        <td className="td-btn td-edit"><a onClick={(e) => {
                                                            setTeacherId(_id)
                                                            oneTeacherFetchHandler(_id)
                                                        }}>Edit</a></td>
                                                        <td className="td-btn td-del"><a onClick={(e) => teacherDeleteHandler(e, _id)}>Delete</a></td>
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
            </div>
        </>
    )
}

export default Teachers