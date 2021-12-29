import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

const Home = () => {
    // Login states
    const [regNum, setRegNum] = useState("")
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

    // Login handler
    const loginHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            if (regNum === "") {
                setError("Enter a registration number")
            }
            else if (password === "") {
                setError("Enter a password")
            }
            else {
                const { data } = await axios.post(`http://localhost:3300/api/users/login`, {
                    regNum: regNum,
                    password: password
                }, configCommon)

                // Validate
                if (data.auth) {
                    setError("")
                    // Save login data in local storage
                    localStorage.setItem("userLogin", JSON.stringify(data))
                    // Navigate to dashboard
                    history.push("/dashboard")
                }
                else {
                    throw Error(data.errors.message)
                }
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
            <section className="main-sec">
                <div className="home-content">
                    <h1 className="heading">Welcome to Izoid Center Portal</h1>
                    <div className="lg-frm">
                        <h2>Login</h2>
                        <form>
                            <InputBox placeText="Registration Number" type="text" inputState={regNumState} />
                            <InputBox placeText="Password" type="password" inputState={passwordState} />
                            <SubmitBtn text="Login" clickFunc={loginHandler} />
                            {error && <div className="err-msg">{error}</div>}
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
