import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import Loader from "../Elements/Loader"

const Meetings = () => {
    // Assignment data states
    const [meetings, setMeetings] = useState("")
    const [meetingId, setMeetingId] = useState("")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
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
    const subjectState = (newVal) => {
        setError("")
        setSuccess("")
        setSubject(newVal)
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

    const timeState = (newVal) => {
        setError("")
        setSuccess("")
        setTime(newVal)
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
        setSubject("")
        setDescription("")
        setDate("")
        setTime("")
        setLink("")
        setVisibility("")

        // Clear selected assignment id
        setMeetingId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        meetingsFetchHandler()
    }

    // Meeting fetch handler
    const meetingsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}meetings/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setMeetings(data)
                setLoading(false)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all meetings
    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            meetingsFetchHandler()
        }
        return () => { isMounted = false }
    }, [])

    // Create meeting handler
    const meetingCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_PREFIX}meetings/create`, {
                subject: subject,
                description: description,
                date: date,
                time: time,
                link: link,
                visibility: visibility,
                teacherReg: regCode
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                meetingsFetchHandler()

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

    // Get an meeting by id handler
    const oneMeetingFetchHandler = async (meetingId) => {
        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}meetings/${meetingId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setSubject(data.subject)
                setDescription(data.description)
                setDate(data.date)
                setTime(data.time)
                setLink(data.link)
                setVisibility(data.visibility)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update an meeting handler
    const meetingUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}meetings/${meetingId}`, {
                subject: subject,
                description: description,
                date: date,
                time: time,
                link: link,
                visibility: visibility,
                teacherReg: regCode
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                meetingsFetchHandler()

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

    // Delete a meeting handler
    const meetingDeleteHandler = async (e, meetingId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this meeting?")) {
            // Api call
            try {
                const { data } = await axios.delete(`${process.env.REACT_APP_API_PREFIX}meetings/${meetingId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    meetingsFetchHandler()
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

    // Search a meeting by a query handler
    const meetingSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}meetings/search/${query}`, configCommon)
                setMeetings(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            meetingsFetchHandler()
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
                                <h2>Manage Meetings</h2>
                                <form>
                                    <div className="inputs">
                                        <InputBox placeText="Title" defaultValue={subject} type="text" inputState={subjectState} />
                                        <textarea className="textarea-box" placeholder="Description" value={description} type="text" onChange={(e) => descriptionState(e.target.value)}></textarea>
                                        <div className="date">
                                            <label className="date-text" htmlFor="date_picker">Meeting Date</label>
                                            <input type="date" id="date_picker" min={new Date().toISOString().split("T")[0]} className="date-picker" value={date} onChange={(e) => dateState(e.target.value)} />
                                        </div>
                                        <div className="date">
                                            <label className="date-text" htmlFor="time_picker">Meeting Time</label>
                                            <input type="time" id="time_picker" className="date-picker" value={time} onChange={(e) => timeState(e.target.value)} />
                                        </div>
                                        <InputBox placeText="Meeting Link" defaultValue={link} type="text" inputState={linkState} />
                                        <div className="select-box">
                                            <label className="drop-text" htmlFor="drop-visi">Visibility</label>
                                            <select id="drop-visi" value={visibility} className="frm-drop" onChange={(e) => visibilityState(e.target.value)}>
                                                <option value=""></option>
                                                <option value="Public">Public</option>
                                                <option value="Private">Private</option>
                                            </select>
                                        </div>
                                    </div>
                                    <SubmitBtn clickFunc={!meetingId ? meetingCreateHandler : meetingUpdateHandler} text={!meetingId ? "Add a Meeting" : "Update an Assignment"} />
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
                                        <InputBox placeText="Search Meetings..." inputState={meetingSearchHandler} />
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Subject</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Goto Meeting</th>
                                                <th>Visibility</th>
                                                <th>Creation Date</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                meetings.length > 0 && (
                                                    meetings.map((obj, index) => {
                                                        const { _id, subject, description, date, time, link, visibility, createdAt } = obj
                                                        return (
                                                            <tr key={_id}>
                                                                <td>{index + 1}</td>
                                                                <td>{subject}</td>
                                                                <td>{description}</td>
                                                                <td>{date}</td>
                                                                <td>{time}</td>
                                                                <td className="td-btn td-view"><a href={link} target="_blank">Join</a></td>
                                                                <td>{visibility}</td>
                                                                <td>{createdAt}</td>
                                                                <td className="td-btn td-edit"><a onClick={(e) => {
                                                                    setMeetingId(_id)
                                                                    oneMeetingFetchHandler(_id)
                                                                }}>Edit</a></td>
                                                                <td className="td-btn td-del"><a onClick={(e) => meetingDeleteHandler(e, _id)}>Delete</a></td>
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

export default Meetings

