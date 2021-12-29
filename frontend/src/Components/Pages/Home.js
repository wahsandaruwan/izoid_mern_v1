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
        setRegNum(newVal)
    }

    const passwordState = (newVal) => {
        setPassword(newVal)
    }

    // Redirect to dashboard if user logged in
    // const userLoginData = localStorage.getItem("userLogin")
    // if (userLoginData) {
    //     history.push("/dashboard")
    // }

    // Login handler
    const loginHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`http://localhost:3300/api/users/login`, {
                regNum: regNum,
                password: password
            }, configCommon)

            // Validate
            if (data.auth) {
                setError("")
                console.log(data)
            }
            else {
                throw Error(data.errors.message)
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
                        <form action="">
                            <InputBox placeText="Registration Number" type="text" inputState={regNumState} />
                            <InputBox placeText="Password" type="password" inputState={passwordState} />
                            <SubmitBtn text="Login" clickFunc={loginHandler} />
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
