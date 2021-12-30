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
    const { token } = JSON.parse(userLoginData)

    // Api request configurations
    const configCommon = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    const configPost = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    // Set history
    const history = useHistory()

    // Update states
    const firstNameState = (newVal) => {
        setError("")
        setFirstName(newVal)
    }

    const lastNameState = (newVal) => {
        setError("")
        setLastName(newVal)
    }

    const typeState = (newVal) => {
        setError("")
        setType(newVal)
    }

    const emailState = (newVal) => {
        setError("")
        setEmail(newVal)
    }

    const passwordState = (newVal) => {
        setError("")
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
        setSuccess("")
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
    const createAdminHandler = async (e) => {
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
                clearAll()

                // Clear message
                setTimeout(() => {
                    setSuccess("")
                }, 5000)
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
            console.log(err)
            setSuccess("")
            setError(err.message)
        }
    }

    // Get an admin by id handler
    const getAnAdminHandler = async (adminId) => {
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

    return (
        <>
            <section className="main-sec">
                <div className="data-content">
                    <div className="data-form">
                        <h2>Manage Admins</h2>
                        <form>
                            <InputBox placeText="First Name" defaultValue={firstName} type="text" inputState={firstNameState} />
                            <InputBox placeText="Last Name" defaultValue={lastName} type="text" inputState={lastNameState} />
                            <select id="drop-down" value={type} className="frm-drop" onChange={(e) => typeState(e.target.value)}>
                                <option value=""></option>
                                <option value="Manager">Manager</option>
                                <option value="Owner">Owner</option>
                            </select>
                            <InputBox placeText="Email" defaultValue={email} type="text" inputState={emailState} />
                            <InputBox placeText="Password" defaultValue={password} type="password" inputState={passwordState} />
                            <SubmitBtn clickFunc={createAdminHandler} text={!adminId ? "Add an Admin" : "Update an Admin"} />
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
                                                            getAnAdminHandler(_id)
                                                        }}>Edit</a></td>
                                                        <td className="td-btn td-del"><a>Delete</a></td>
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
            </section>
        </>
    )
}

export default Admins
