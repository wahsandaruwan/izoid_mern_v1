import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import Loader from "../Elements/Loader"

const AssignmentAssign = ({ clsId }) => {
    // Assignment data states
    const [assignments, setAssignments] = useState("")
    const [assignmentId, setAssignmentId] = useState("")
    const [assignmentsOfCls, setAssignmentsOfCls] = useState("")
    const [searchResult, setSearchResult] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Loading state
    const [loading, setLoading] = useState(true)

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    let jwt = ""
    let userType = ""
    let regCode = ""
    if (userLoginData) {
        const { token, type, regNum } = JSON.parse(userLoginData)
        jwt = token
        userType = type
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
    const assignmentIdState = (newVal) => {
        setError("")
        setSuccess("")
        console.log(newVal)
        setAssignmentId(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setAssignmentId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)
    }

    // Handle fetching all data
    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            oneClassFetchHandler()
            assignmentsFetchByRegCodeHandler()
        }
        return () => { isMounted = false }
    }, [])

    // Get a class by id handler
    const oneClassFetchHandler = async () => {
        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}classes/${clsId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                console.log(data)
                setSearchResult(data[0].acl)
                setAssignmentsOfCls(data[0].acl)
                setLoading(false)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Assign assignment handler
    const assignAssignmentHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}classes/assignments/${clsId}`, {
                assignmentId: assignmentId
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                oneClassFetchHandler()

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

    // Assignments fetch by teacher reg code handler
    const assignmentsFetchByRegCodeHandler = async () => {

        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}assignments/reg/${regCode}`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                console.log(data)
                setAssignments(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Delete assignment handler
    const assignmentDeleteHandler = async (e, assignmentId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this assignment from this class?")) {
            // Api call
            try {
                const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}classes/assignments/delete/${clsId}`, {
                    assignmentId: assignmentId
                }, configPost)

                if (data.created) {
                    alert(data.success.message)
                    oneClassFetchHandler()

                    // Clear alls
                    clearAll(e)
                }
                else {
                    if (data.authEx) {
                        alert(data.errors.message)

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
                alert(err.message)
            }
        }
    }

    // Search assignment handler
    const searchAssignmentHandler = (query) => {
        if (query) {
            let result = searchResult.filter((el) => {
                if (el.title.toLowerCase().includes(query.toLowerCase()) || el.description.toLowerCase().includes(query.toLowerCase()) || el.date.toLowerCase().includes(query.toLowerCase())) {
                    return el
                }
            })
            console.log(result)
            setAssignmentsOfCls(result)
        }
        else {
            oneClassFetchHandler()
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
                            {
                                userType === "Teacher" ? (
                                    <div className="data-form">
                                        <h2>Assign Assignments</h2>
                                        <form>
                                            <div className="select-box">
                                                <label className="drop-text" htmlFor="drop-asi">Assignment Title</label>
                                                <select id="drop-asi" value={assignmentId} className="frm-drop" onChange={(e) => assignmentIdState(e.target.value)}>
                                                    <option value=""></option>
                                                    {
                                                        assignments.length > 0 && (
                                                            assignments.map((obj) => {
                                                                const { _id, title } = obj
                                                                return (
                                                                    <option value={_id} key={_id}>{title}</option>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <SubmitBtn clickFunc={assignAssignmentHandler} text="Assign Assignments" />
                                            <a className="clear-btn" onClick={(e) => clearAll(e)}>Clear All</a>
                                            {error &&
                                                <div className="msg err">{error}</div>
                                            }
                                            {success &&
                                                <div className="msg success">{success}</div>
                                            }
                                        </form>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                            <div className="data-table">
                                <div>
                                    <div className="search-sec">
                                        <InputBox placeText="Search Assigned Assignments..." inputState={searchAssignmentHandler} />
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Assignment Title</th>
                                                <th>Description</th>
                                                <th>Due Date</th>
                                                <th>Download</th>
                                                {
                                                    userType === "Teacher" && (
                                                        <th>Delete</th>
                                                    )
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                assignmentsOfCls.length > 0 && (
                                                    assignmentsOfCls.map((obj, index) => {
                                                        const { _id, title, description, date, link } = obj
                                                        return (
                                                            <tr key={_id}>
                                                                <td>{index + 1}</td>
                                                                <td>{title}</td>
                                                                <td>{description}</td>
                                                                <td>{date}</td>
                                                                <td className="td-btn td-view"><a href={link} target="_blank">Download</a></td>
                                                                {
                                                                    userType === "Teacher" && (
                                                                        <td className="td-btn td-del"><a onClick={(e) => assignmentDeleteHandler(e, _id)}>Delete</a></td>
                                                                    )
                                                                }
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

export default AssignmentAssign
