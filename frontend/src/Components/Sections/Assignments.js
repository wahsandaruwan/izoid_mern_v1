import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import Loader from "../Elements/Loader"

const Assignments = () => {
    // Assignment data states
    const [assignments, setAssignments] = useState("")
    const [assignmentId, setAssignmentId] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [link, setLink] = useState("")
    const [visibility, setVisibility] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Loading state
    const [loading, setLoading] = useState(true)

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    let jwt = ""
    let regCode = ""
    if (userLoginData) {
        const { token, regNum } = JSON.parse(userLoginData)
        jwt = token
        regCode = regNum
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
    const titleState = (newVal) => {
        setError("")
        setSuccess("")
        setTitle(newVal)
    }

    const descriptionState = (newVal) => {
        setError("")
        setSuccess("")
        setDescription(newVal)
    }

    const dateState = (newVal) => {
        setError("")
        setSuccess("")
        setDate(newVal)
    }

    const linkState = (newVal) => {
        setError("")
        setSuccess("")
        setLink(newVal)
    }

    const visibilityState = (newVal) => {
        setError("")
        setSuccess("")
        setVisibility(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setTitle("")
        setDescription("")
        setDate("")
        setLink("")
        setVisibility("")

        // Clear selected assignment id
        setAssignmentId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        assignmentsFetchHandler()
    }

    // Assignment fetch handler
    const assignmentsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}assignments/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setAssignments(data)
                setLoading(false)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all assignments
    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            assignmentsFetchHandler()
        }
        return () => { isMounted = false }
    }, [])

    // Create assignment handler
    const assignmentCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_PREFIX}assignments/create`, {
                title: title,
                description: description,
                date: date,
                link: link,
                visibility: visibility,
                teacherReg: regCode
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                assignmentsFetchHandler()

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

    // Get an assignment by id handler
    const oneAssignmentFetchHandler = async (assignmentId) => {
        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}assignments/${assignmentId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setTitle(data.title)
                setDescription(data.description)
                setDate(data.date)
                setLink(data.link)
                setVisibility(data.visibility)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update an assignment handler
    const assignmentUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}assignments/${assignmentId}`, {
                title: title,
                description: description,
                date: date,
                link: link,
                visibility: visibility,
                teacherReg: regCode
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                assignmentsFetchHandler()

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

    // Delete an assignment handler
    const assignmentDeleteHandler = async (e, assignmentId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this assignment?")) {
            // Api call
            try {
                const { data } = await axios.delete(`${process.env.REACT_APP_API_PREFIX}assignments/${assignmentId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    assignmentsFetchHandler()
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

    // Search an assignment by a query handler
    const assignmentSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}assignments/search/${query}`, configCommon)
                setAssignments(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            assignmentsFetchHandler()
        }
    }

    return (
        <>
            <div className="data-content">
                {
                    loading ? (
                        <Loader />
                    ) : (
                        <div>
                            <div className="data-form">
                                <h2>Manage Assignments</h2>
                                <form>
                                    <InputBox placeText="Title" defaultValue={title} type="text" inputState={titleState} />
                                    <textarea className="textarea-box" placeholder="Description" value={description} type="text" onChange={(e) => descriptionState(e.target.value)}></textarea>
                                    <div className="date">
                                        <label className="date-text" htmlFor="date_picker">Due Date</label>
                                        <input type="date" id="date_picker" min={new Date().toISOString().split("T")[0]} className="date-picker" value={date} onChange={(e) => dateState(e.target.value)} />
                                    </div>
                                    <InputBox placeText="Assignment Link" defaultValue={link} type="text" inputState={linkState} />
                                    <div className="select-box">
                                        <label className="drop-text" htmlFor="drop-visi">Visibility</label>
                                        <select id="drop-visi" value={visibility} className="frm-drop" onChange={(e) => visibilityState(e.target.value)}>
                                            <option value=""></option>
                                            <option value="Public">Public</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </div>
                                    <SubmitBtn clickFunc={!assignmentId ? assignmentCreateHandler : assignmentUpdateHandler} text={!assignmentId ? "Add an Assignment" : "Update an Assignment"} />
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
                                        <InputBox placeText="Search Assignments..." inputState={assignmentSearchHandler} />
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Due Date</th>
                                                <th>Download</th>
                                                <th>Visibility</th>
                                                <th>Creation Date</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                assignments.length > 0 && (
                                                    assignments.map((obj, index) => {
                                                        const { _id, title, description, date, link, visibility, createdAt } = obj
                                                        return (
                                                            <tr key={_id}>
                                                                <td>{index + 1}</td>
                                                                <td>{title}</td>
                                                                <td>{description}</td>
                                                                <td>{date}</td>
                                                                <td className="td-btn td-view"><a href={link} target="_blank">Download</a></td>
                                                                <td>{visibility}</td>
                                                                <td>{createdAt}</td>
                                                                <td className="td-btn td-edit"><a onClick={(e) => {
                                                                    setAssignmentId(_id)
                                                                    oneAssignmentFetchHandler(_id)
                                                                }}>Edit</a></td>
                                                                <td className="td-btn td-del"><a onClick={(e) => assignmentDeleteHandler(e, _id)}>Delete</a></td>
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
                    )
                }
            </div>
        </>
    )
}

export default Assignments
