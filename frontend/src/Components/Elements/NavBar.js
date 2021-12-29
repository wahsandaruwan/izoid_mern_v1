import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";

const NavBar = () => {
    // Logged user state
    const [loggedUser, setLoggedUser] = useState("")

    // Set history
    const history = useHistory()

    // Get user data from local storage
    const getUserData = () => {
        const userLoginData = localStorage.getItem("userLogin")
        if (userLoginData) {
            const { firstName } = JSON.parse(userLoginData)
            setLoggedUser(firstName)
        }
    }
    useEffect(() => {
        getUserData()
    }, [])

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
                    <li><a href="#">Manage Students</a></li>
                    <li><a href="#">Manage Teachers</a></li>
                    <li><a href="#">Manage Subjects</a></li>
                    <li><a href="#">Manage Groups</a></li>
                    <li><a href="#">Manage Admins</a></li>
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
