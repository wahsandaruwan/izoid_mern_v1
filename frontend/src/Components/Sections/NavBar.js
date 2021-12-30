import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";

const NavBar = ({ displaySec, activeSec }) => {
    // Set history
    const history = useHistory()

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    let loggedUser = ""
    if (userLoginData) {
        const { firstName } = JSON.parse(userLoginData)
        loggedUser = firstName
    }

    // Logout handler
    const logoutHandler = (e) => {
        e.preventDefault();
        localStorage.clear()
        history.push("/")
    }

    return (
        <>
            <div className="nav-menu">
                <div className="logo">
                    <h2>Izoid <br></br>Center</h2>
                </div>
                <ul className="menu">
                    <li><a className={`${activeSec === "combinations" ? "active" : ""}`} onClick={(e) => displaySec("combinations")}>Manage Combinations</a></li>
                    <li><a className={`${activeSec === "students" ? "active" : ""}`} onClick={(e) => displaySec("students")}>Manage Students</a></li>
                    <li><a className={`${activeSec === "teachers" ? "active" : ""}`} onClick={(e) => displaySec("teachers")}>Manage Teachers</a></li>
                    <li><a className={`${activeSec === "subjects" ? "active" : ""}`} onClick={(e) => displaySec("subjects")}>Manage Subjects</a></li>
                    <li><a className={`${activeSec === "grades" ? "active" : ""}`} onClick={(e) => displaySec("grades")}>Manage Grades</a></li>
                    <li><a className={`${activeSec === "groups" ? "active" : ""}`} onClick={(e) => displaySec("groups")}>Manage Groups</a></li>
                    <li><a className={`${activeSec === "admins" ? "active" : ""}`} onClick={(e) => displaySec("admins")}>Manage Admins</a></li>
                </ul>
                <div className="user">
                    <h3>Welcome {loggedUser}!</h3>
                    <a className="lgo-btn" onClick={(e) => logoutHandler(e)}>Logout</a>
                </div>
            </div>
        </>
    )
}

export default NavBar
