import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Admins = () => {
    // Admin data states
    const [admins, setAdmins] = useState("")
    const [regNum, setRegNum] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [type, setType] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    const { token } = JSON.parse(userLoginData)

    // Api request configurations
    const configCommon = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    // Set history
    const history = useHistory()

    // Update states
    const regNumState = (newVal) => {
        setError("")
        setRegNum(newVal)
    }

    const passwordState = (newVal) => {
        setError("")
        setPassword(newVal)
    }

    // Admin fetch handler
    const adminFetchHandler = async () => {
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
        adminFetchHandler()
    }, [])

    return (
        <>
            <section className="main-sec">
                <div className="data-content">
                    <div className="data-form">
                        <h2>Manage Admins</h2>
                        <form>
                            <InputBox placeText="Registration Code" type="text" inputState={regNumState} />
                            <InputBox />
                            <InputBox />
                            <InputBox />
                            <InputBox />
                            <SubmitBtn text="Save" />
                        </form>
                    </div>
                    <div className="data-table">
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
                                                    <td className="td-btn td-edit"><a>Edit</a></td>
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
            </section>
        </>
    )
}

export default Admins
