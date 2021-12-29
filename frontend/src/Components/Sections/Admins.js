import { useState } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Admins = () => {
    // Admin data states
    const [regNum, setRegNum] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [type, setType] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    // Api request configurations
    const configCommon = {
        headers: {
            "Content-Type": "application/json"
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

    // Redirect to dashboard if user logged in
    const userLoginData = localStorage.getItem("userLogin")
    if (userLoginData) {
        history.push("/dashboard")
    }

    // Admin fetch handler


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
                                <tr>
                                    <td>1</td>
                                    <td>f54355</td>
                                    <td>dfgdfh</td>
                                    <td>ngfmfdf</td>
                                    <td>hffj</td>
                                    <td>fgdffh@dgdg.lk</td>
                                    <td>
                                        <a href="#">Edit</a>
                                    </td>
                                    <td>
                                        <a href="#">Delete</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>f54355</td>
                                    <td>dfgdfh</td>
                                    <td>ngfmfdf</td>
                                    <td>hffj</td>
                                    <td>fgdffh@dgdg.lk</td>
                                    <td>
                                        <a href="#">Edit</a>
                                    </td>
                                    <td>
                                        <a href="#">Delete</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Admins
