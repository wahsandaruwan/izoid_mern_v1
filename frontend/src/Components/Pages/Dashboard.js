import NavBar from "../Elements/NavBar";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
    // Set history
    const history = useHistory()

    // Redirect to home if user not logged in
    const userLoginData = localStorage.getItem("userLogin")
    if (!userLoginData) {
        history.push("/")
    }

    return (
        <>
            <NavBar />
            <section className="main-sec">
                <h1 className="welcome-msg">Welcome to Izoid Center Protal!</h1>
            </section>
        </>
    )
}

export default Dashboard
