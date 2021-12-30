import { useState } from "react"
import { useHistory } from "react-router-dom";

import NavBar from "../Sections/NavBar";
import Combinations from "../Sections/Combinations";
import Students from "../Sections/Students";
import Teachers from "../Sections/Teachers";
import Subjects from "../Sections/Subjects";
import Grades from "../Sections/Grades";
import Groups from "../Sections/Groups";
import Admins from "../Sections/Admins";

const Dashboard = () => {
    // Dashboard sections state
    const [display, setDisplay] = useState("combinations")

    // Set history
    const history = useHistory()

    // Update section state
    const updateDisplayState = (newVal) => {
        setDisplay(newVal)
    }

    // Redirect to home if user not logged in
    const userLoginData = localStorage.getItem("userLogin")
    if (!userLoginData) {
        history.push("/")
    }

    return (
        <>
            <section className="dash-sec">
                <NavBar displaySec={updateDisplayState} activeSec={display} />
                {/* <h1 className="welcome-msg">Welcome to Izoid Center Protal!</h1> */}
                {display === "combinations" && <Combinations />}
                {display === "students" && <Students />}
                {display === "teachers" && <Teachers />}
                {display === "subjects" && <Subjects />}
                {display === "grades" && <Grades />}
                {display === "groups" && <Groups />}
                {display === "admins" && <Admins />}
            </section>
        </>
    )
}

export default Dashboard
