import { useState } from "react"
import { useHistory } from "react-router-dom";

import NavBar from "../Sections/NavBar";
import Classes from "../Sections/Classes";
import Students from "../Sections/Students";
import Teachers from "../Sections/Teachers";
import Subjects from "../Sections/Subjects";
import Grades from "../Sections/Grades";
import Groups from "../Sections/Groups";
import Admins from "../Sections/Admins";
import StudentAssign from "../Sections/StudentAssign";
import Assignments from "../Sections/Assignments";
import AssignmentAssign from "../Sections/AssignmentAssign";
import MeetingAssign from "../Sections/MeetingAssign";
import Meetings from "../Sections/Meetings";

const Dashboard = () => {
    // Dashboard sections state
    const [display, setDisplay] = useState("classes")

    // Current class id state
    const [classId, setClassId] = useState("")

    // Set history
    const history = useHistory()

    // Update section state
    const updateDisplayState = (newVal) => {
        setDisplay(newVal)
    }

    // Update class id state
    const updateClassIDSate = (newVal) => {
        setClassId(newVal)
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
                {display === "classes" && <Classes displaySec={updateDisplayState} classIdState={updateClassIDSate} />}
                {display === "students" && <Students />}
                {display === "teachers" && <Teachers />}
                {display === "subjects" && <Subjects />}
                {display === "grades" && <Grades />}
                {display === "groups" && <Groups />}
                {display === "admins" && <Admins />}
                {display === "student" && <StudentAssign clsId={classId} />}
                {display === "assignments" && <Assignments />}
                {display === "assignment" && <AssignmentAssign clsId={classId} />}
                {display === "meetings" && <Meetings />}
                {display === "meeting" && <MeetingAssign clsId={classId} />}
            </section>
        </>
    )
}

export default Dashboard
