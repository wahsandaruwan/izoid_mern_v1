import { useState } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Home = () => {
    // Login states
    const [type, setType] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    // Api request configurations
    const configPost = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    // Set history
    const history = useHistory()

    // Update states
    // Update states
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

    // Redirect to dashboard if user logged in
    const userLoginData = localStorage.getItem("userLogin")
    if (userLoginData) {
        history.push("/dashboard")
    }

    // Login handler
    const loginHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            if (type === "") {
                setError("Choose user type!")
            }
            else if (email === "") {
                setError("Enter an email!")
            }
            else if (password === "") {
                setError("Enter a password!")
            }
            else {
                let loginData = ""
                if (type === "Admin") {
                    const { data } = await axios.post(`${process.env.REACT_APP_API_PREFIX}admins/login`, {
                        type: type,
                        email: email,
                        password: password
                    }, configPost)
                    loginData = data
                }
                else if (type === "Teacher") {
                    const { data } = await axios.post(`${process.env.REACT_APP_API_PREFIX}teachers/login`, {
                        email: email,
                        password: password
                    }, configPost)
                    loginData = data
                }
                else if (type === "Student") {
                    const { data } = await axios.post(`${process.env.REACT_APP_API_PREFIX}students/login`, {
                        email: email,
                        password: password
                    }, configPost)
                    loginData = data
                }

                // Response validate
                if (loginData.auth) {
                    setError("")
                    // Save login data in local storage
                    localStorage.setItem("userLogin", JSON.stringify(loginData))
                    // Navigate to dashboard
                    history.push("/dashboard")
                }
                else {
                    throw Error(loginData.errors.message)
                }
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
            <section className="home-sec">
                <div className="home-content">
                    <div className="logo">
                        <h2>Izoid <br></br>Center</h2>
                    </div>
                    <h1 className="heading">Welcome to Izoid Education Center</h1>
                    <div className="lg-frm">
                        <h2>Login</h2>
                        <form>
                            <div className="select-box">
                                <label className="drop-text" htmlFor="drop-login">User Type</label>
                                <select id="drop-login" value={type} className="frm-drop" onChange={(e) => typeState(e.target.value)}>
                                    <option value=""></option>
                                    <option value="Admin">Admin</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Student">Student</option>
                                </select>
                            </div>
                            <InputBox placeText="Email" type="text" inputState={emailState} />
                            <InputBox placeText="Password" type="password" inputState={passwordState} />
                            <SubmitBtn text="Login" clickFunc={loginHandler} />
                            {error && <div className="msg err">{error}</div>}
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
