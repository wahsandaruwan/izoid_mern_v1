import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Grades = () => {
    // Grade data states
    const [grades, setGrades] = useState("")
    const [gradeId, setGradeId] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    let jwt = ""
    if (userLoginData) {
        const { token } = JSON.parse(userLoginData)
        jwt = token
    }

    // Api request configurations
    const configCommon = {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }

    const configPost = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    }

    // Set history
    const history = useHistory()

    // Update states
    const nameState = (newVal) => {
        setError("")
        setSuccess("")
        setName(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setName("")

        // Clear selected grade id
        setGradeId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        gradesFetchHandler()
    }

    // Grades fetch handler
    const gradesFetchHandler = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3300/api/grades/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setGrades(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all grades
    useEffect(() => {
        gradesFetchHandler()
    }, [])

    // Create grade handler
    const gradeCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`http://localhost:3300/api/grades/create`, {
                name: name
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                gradesFetchHandler()

                // Clear all
                clearAll(e)
            }
            else {
                if (data.authEx) {
                    setSuccess("")
                    setError(data.errors.message)

                    setTimeout(() => {
                        // Clear local storage
                        localStorage.clear()
                        history.push("/")
                    }, 5000)
                }
                else {
                    throw Error(data.errors.message)
                }
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Get a grade by id handler
    const oneGradeFetchHandler = async (gradeId) => {
        // Api call
        try {
            const { data } = await axios.get(`http://localhost:3300/api/grades/${gradeId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setName(data.name)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update a grade handler
    const gradeUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`http://localhost:3300/api/grades/${gradeId}`, {
                name: name
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                gradesFetchHandler()

                // Clear all
                clearAll(e)
            }
            else {
                if (data.authEx) {
                    setSuccess("")
                    setError(data.errors.message)

                    setTimeout(() => {
                        // Clear local storage
                        localStorage.clear()
                        history.push("/")
                    }, 5000)
                }
                else {
                    throw Error(data.errors.message)
                }
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Delete a grade handler
    const gradeDeleteHandler = async (e, gradeId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this grade?")) {
            // Api call
            try {
                const { data } = await axios.delete(`http://localhost:3300/api/grades/${gradeId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    gradesFetchHandler()
                }
                else {
                    if (data.authEx) {
                        alert(data.errors.message)

                        // Clear local storage
                        localStorage.clear()
                        history.push("/")
                    }
                    else {
                        throw Error(data.errors.message)
                    }
                }
            } catch (err) {
                alert(err.message)
            }
        }
    }

    // Search a grade by a query handler
    const gradeSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`http://localhost:3300/api/grades/search/${query}`, configCommon)
                setGrades(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            gradesFetchHandler()
        }
    }

    return (
        <>
            <div className="data-content">
                <div>
                    <div className="data-form">
                        <h2>Manage Grades</h2>
                        <form>
                            <InputBox placeText="Name" defaultValue={name} type="text" inputState={nameState} />
                            <SubmitBtn clickFunc={!gradeId ? gradeCreateHandler : gradeUpdateHandler} text={!gradeId ? "Add a Grade" : "Update a Grade"} />
                            <a className="clear-btn" onClick={(e) => clearAll(e)}>Clear All</a>
                            {error &&
                                <div className="msg err">{error}</div>
                            }
                            {success &&
                                <div className="msg success">{success}</div>
                            }
                        </form>
                    </div>
                    <div className="data-table">
                        <div>
                            <div className="search-sec">
                                <InputBox placeText="Search Grades..." inputState={gradeSearchHandler} />
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        grades.length > 0 && (
                                            grades.map((obj, index) => {
                                                const { _id, name } = obj
                                                return (
                                                    <tr key={_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{name}</td>
                                                        <td className="td-btn td-edit"><a onClick={(e) => {
                                                            setGradeId(_id)
                                                            oneGradeFetchHandler(_id)
                                                        }}>Edit</a></td>
                                                        <td className="td-btn td-del"><a onClick={(e) => gradeDeleteHandler(e, _id)}>Delete</a></td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Grades
