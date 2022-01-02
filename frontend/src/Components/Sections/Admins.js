import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Admins = () => {
    // Admin data states
    const [admins, setAdmins] = useState("")
    const [adminId, setAdminId] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [type, setType] = useState("")
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

    const typeState = (newVal) => {
        setError("")
        setSuccess("")
        setType(newVal)
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
        setType("")
        setEmail("")
        setPassword("")

        // Clear selected admin id
        setAdminId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        adminsFetchHandler()
    }

    // Admin fetch handler
    const adminsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3300/api/admins/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setAdmins(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all admins
    useEffect(() => {
        adminsFetchHandler()
    }, [])

    // Create admin handler
    const adminCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`http://localhost:3300/api/admins/register`, {
                firstName: firstName,
                lastName: lastName,
                type: type,
                email: email,
                password: password
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                adminsFetchHandler()

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

    // Get an admin by id handler
    const oneAdminFetchHandler = async (adminId) => {
        // Api call
        try {
            const { data } = await axios.get(`http://localhost:3300/api/admins/${adminId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setFirstName(data.firstName)
                setLastName(data.lastName)
                setType(data.type)
                setEmail(data.email)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update an admin handler
    const adminUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`http://localhost:3300/api/admins/${adminId}`, {
                firstName: firstName,
                lastName: lastName,
                type: type,
                email: email,
                password: password
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                adminsFetchHandler()

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

    // Delete an admin handler
    const adminDeleteHandler = async (e, adminId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this admin?")) {
            // Api call
            try {
                const { data } = await axios.delete(`http://localhost:3300/api/admins/${adminId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    adminsFetchHandler()
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

    // Search an admin by a query handler
    const adminSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`http://localhost:3300/api/admins/search/${query}`, configCommon)
                setAdmins(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            adminsFetchHandler()
        }
    }

    return (
        <>
            <div className="data-content">
                <div>
                    <div className="data-form">
                        <h2>Manage Admins</h2>
                        <form>
                            <InputBox placeText="First Name" defaultValue={firstName} type="text" inputState={firstNameState} />
                            <InputBox placeText="Last Name" defaultValue={lastName} type="text" inputState={lastNameState} />
                            <div className="select-box">
                                <label className="drop-text" htmlFor="drop-down1">Admin Type</label>
                                <select id="drop-down1" value={type} className="frm-drop" onChange={(e) => typeState(e.target.value)}>
                                    <option value=""></option>
                                    <option value="Manager">Manager</option>
                                    <option value="Owner">Owner</option>
                                </select>
                            </div>
                            <InputBox placeText="Email" defaultValue={email} type="text" inputState={emailState} />
                            <InputBox placeText={!adminId ? "Password" : "New Password (Leave it empty to keep it unchanged)"} defaultValue={password} type="password" inputState={passwordState} />
                            <SubmitBtn clickFunc={!adminId ? adminCreateHandler : adminUpdateHandler} text={!adminId ? "Add an Admin" : "Update an Admin"} />
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
                                <InputBox placeText="Search Admins..." inputState={adminSearchHandler} />
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Registration Code</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Type</th>
                                        <th>Email</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        admins.length > 0 && (
                                            admins.map((obj, index) => {
                                                const { _id, regNum, firstName, lastName, type, email } = obj
                                                return (
                                                    <tr key={_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{regNum}</td>
                                                        <td>{firstName}</td>
                                                        <td>{lastName}</td>
                                                        <td>{type}</td>
                                                        <td>{email}</td>
                                                        <td className="td-btn td-edit"><a onClick={(e) => {
                                                            setAdminId(_id)
                                                            oneAdminFetchHandler(_id)
                                                        }}>Edit</a></td>
                                                        <td className="td-btn td-del"><a onClick={(e) => adminDeleteHandler(e, _id)}>Delete</a></td>
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

export default Admins
