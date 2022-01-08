import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import Loader from "../Elements/Loader"

const MeetingAssign = ({ clsId }) => {
    // Meeting data states
    const [meetings, setMeetings] = useState("")
    const [meetingId, setMeetingId] = useState("")
    const [meetingsOfCls, setMeetingsOfCls] = useState("")
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
    const meetingIdState = (newVal) => {
        setError("")
        setSuccess("")
        console.log(newVal)
        setMeetingId(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setMeetingId("")

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
            meetingsFetchByRegCodeHandler()
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
                setSearchResult(data[0].mcl)
                setMeetingsOfCls(data[0].mcl)
                setLoading(false)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Assign meeting handler
    const assignMeetingHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}classes/meetings/${clsId}`, {
                meetingId: meetingId
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

    // Meetings fetch by teacher reg code handler
    const meetingsFetchByRegCodeHandler = async () => {

        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}meetings/reg/${regCode}`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                console.log(data)
                setMeetings(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Delete meeting handler
    const meetingDeleteHandler = async (e, meetingId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this assignment from this class?")) {
            // Api call
            try {
                const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}classes/meetings/delete/${clsId}`, {
                    meetingId: meetingId
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

    // Search meeting handler
    const searchMeetingHandler = (query) => {
        if (query) {
            let result = searchResult.filter((el) => {
                if (el.subject.toLowerCase().includes(query.toLowerCase()) || el.description.toLowerCase().includes(query.toLowerCase()) || el.date.toLowerCase().includes(query.toLowerCase()) || el.time.toLowerCase().includes(query.toLowerCase())) {
                    return el
                }
            })
            console.log(result)
            setMeetingsOfCls(result)
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
                                        <h2>Assign Meetings</h2>
                                        <form>
                                            <div className="select-box">
                                                <label className="drop-text" htmlFor="drop-met">Meeting Subject</label>
                                                <select id="drop-met" value={meetingId} className="frm-drop" onChange={(e) => meetingIdState(e.target.value)}>
                                                    <option value=""></option>
                                                    {
                                                        meetings.length > 0 && (
                                                            meetings.map((obj) => {
                                                                const { _id, subject } = obj
                                                                return (
                                                                    <option value={_id} key={_id}>{subject}</option>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <SubmitBtn clickFunc={assignMeetingHandler} text="Assign Meetings" />
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
                                        <InputBox placeText="Search Assigned Meetings..." inputState={searchMeetingHandler} />
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Meeting Subject</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Join Meeting</th>
                                                {
                                                    userType === "Teacher" && (
                                                        <th>Delete</th>
                                                    )
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                meetingsOfCls.length > 0 && (
                                                    meetingsOfCls.map((obj, index) => {
                                                        const { _id, subject, description, date, time, link } = obj
                                                        return (
                                                            <tr key={_id}>
                                                                <td>{index + 1}</td>
                                                                <td>{subject}</td>
                                                                <td>{description}</td>
                                                                <td>{date}</td>
                                                                <td>{time}</td>
                                                                <td className="td-btn td-view"><a href={link} target="_blank">Join</a></td>
                                                                {
                                                                    userType === "Teacher" && (
                                                                        <td className="td-btn td-del"><a onClick={(e) => meetingDeleteHandler(e, _id)}>Delete</a></td>
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

export default MeetingAssign
