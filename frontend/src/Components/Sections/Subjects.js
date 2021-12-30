import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Subjects = () => {
    // Admin data states
    const [subjects, setSubjects] = useState("")
    const [subjectId, setSubjectId] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    const { token } = JSON.parse(userLoginData)

    // Api request configurations
    const configCommon = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    const configPost = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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

        // Clear selected admin id
        setSubjectId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        subjectsFetchHandler()
    }

    // Subject fetch handler
    const subjectsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3300/api/subjects/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setSubjects(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all subjects
    useEffect(() => {
        subjectsFetchHandler()
    }, [])

    // Create subject handler
    const subjectCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`http://localhost:3300/api/subjects/create`, {
                name: name
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                subjectsFetchHandler()

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

    // Get a subject by id handler
    const oneSubjectFetchHandler = async (subjectId) => {
        // Api call
        try {
            const { data } = await axios.get(`http://localhost:3300/api/subjects/${subjectId}`, configCommon)

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

    // Update a subject handler
    const subjectUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`http://localhost:3300/api/subjects/${subjectId}`, {
                name: name
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                subjectsFetchHandler()

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

    // Delete a subject handler
    const subjectDeleteHandler = async (e, subjectId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this subject?")) {
            // Api call
            try {
                const { data } = await axios.delete(`http://localhost:3300/api/subjects/${subjectId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    subjectsFetchHandler()
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

    // Search a subject handler by a query
    const subjectSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`http://localhost:3300/api/subjects/search/${query}`, configCommon)
                setSubjects(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            subjectsFetchHandler()
        }
    }

    return (
        <>
            <div className="search-sec">
                <InputBox placeText="Search Subjects..." inputState={subjectSearchHandler} />
            </div>
            <div className="data-content">
                <div>
                    <div className="data-form">
                        <h2>Manage Subjects</h2>
                        <form>
                            <InputBox placeText="Name" defaultValue={name} type="text" inputState={nameState} />
                            <SubmitBtn clickFunc={!subjectId ? subjectCreateHandler : subjectUpdateHandler} text={!subjectId ? "Add a Subject" : "Update a Subject"} />
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
                                        subjects.length > 0 && (
                                            subjects.map((obj, index) => {
                                                const { _id, name } = obj
                                                return (
                                                    <tr key={_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{name}</td>
                                                        <td className="td-btn td-edit"><a onClick={(e) => {
                                                            setSubjectId(_id)
                                                            oneSubjectFetchHandler(_id)
                                                        }}>Edit</a></td>
                                                        <td className="td-btn td-del"><a onClick={(e) => subjectDeleteHandler(e, _id)}>Delete</a></td>
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

export default Subjects
