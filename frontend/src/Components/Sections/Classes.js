import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import Loader from "../Elements/Loader"

const Classes = ({ displaySec, classIdState }) => {
    // Class data states
    const [classes, setClasses] = useState("")
    const [classId, setClassId] = useState("")
    const [grade, setGrade] = useState("")
    const [subject, setSubject] = useState("")
    const [group, setGroup] = useState("")
    const [teacherReg, setTeacherReg] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Table row numbers
    let count = 0

    // Loading state
    const [loading, setLoading] = useState(true)

    // Grade data state
    const [grades, setGrades] = useState("")

    // Subject data state
    const [subjects, setSubjects] = useState("")

    // Group data state
    const [groups, setGroups] = useState("")

    // Teacher data state
    const [teachers, setTeachers] = useState("")

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    let jwt = ""
    let userType = ""
    let regCode = ""
    if (userLoginData) {
        const { token, type, regNum } = JSON.parse(userLoginData)
        jwt = token
        userType = type
        console.log(userType)
        regCode = regNum
        console.log(regCode)
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
    const gradeState = (newVal) => {
        setError("")
        setGrade(newVal)
    }

    const subjectState = (newVal) => {
        setError("")
        setSuccess("")
        setSubject(newVal)
    }

    const groupState = (newVal) => {
        setError("")
        setSuccess("")
        setGroup(newVal)
    }

    const teacherRegState = (newVal) => {
        setError("")
        setSuccess("")
        setTeacherReg(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setGrade("")
        setSubject("")
        setGroup("")
        setTeacherReg("")

        // Clear selected teacher id
        setClassId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        classesFetchHandler()
    }

    // Classes fetch handler
    const classesFetchHandler = async () => {
        let loginData = ""
        try {
            if (userType === "Student") {
                const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}classes/student/${regCode}`, configCommon)
                loginData = data
            }
            else {
                const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}classes/`, configCommon)
                loginData = data
            }

            // Response validate
            if (loginData.authEx) {
                alert(loginData.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                console.log(loginData)
                setClasses(loginData)
                setLoading(false)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all data
    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            classesFetchHandler()
            gradesFetchHandler()
            subjectsFetchHandler()
            groupsFetchHandler()
            teachersFetchHandler()
        }
        return () => { isMounted = false }
    }, [])

    // Create class handler
    const classCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_PREFIX}classes/create`, {
                grade: grade,
                subject: subject,
                group: group,
                teacherReg: teacherReg
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                classesFetchHandler()

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

    // Get a class by id handler
    const oneClassFetchHandler = async (classId) => {
        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}classes/${classId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                console.log(data)
                setGrade(data[0].grade)
                setSubject(data[0].subject)
                setGroup(data[0].group)
                setTeacherReg(data[0].teacherReg)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update a class handler
    const classUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}classes/${classId}`, {
                grade: grade,
                subject: subject,
                group: group,
                teacherReg: teacherReg
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                classesFetchHandler()

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

    // Delete a class handler
    const classDeleteHandler = async (e, classId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this class?")) {
            // Api call
            try {
                const { data } = await axios.delete(`${process.env.REACT_APP_API_PREFIX}classes/${classId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    classesFetchHandler()
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

    // Search a class by a query handler
    const classSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}classes/search/${query}`, configCommon)
                setClasses(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            classesFetchHandler()
        }
    }

    // Grades fetch handler
    const gradesFetchHandler = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}grades/`, configCommon)
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

    // Subjects fetch handler
    const subjectsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}subjects/`, configCommon)
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

    // Groups fetch handler
    const groupsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}groups/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setGroups(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Teachers fetch handler
    const teachersFetchHandler = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}teachers/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setTeachers(data)
            }
        } catch (err) {
            alert(err.message)
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
                                userType === "Owner" || userType === "Manager" ? (
                                    <div className="data-form">
                                        <h2>Manage Classes</h2>
                                        <form>
                                            <div className="select-box">
                                                <label className="drop-text" htmlFor="drop-down2">Grade</label>
                                                <select id="drop-down2" value={grade} className="frm-drop" onChange={(e) => gradeState(e.target.value)}>
                                                    <option value=""></option>
                                                    {
                                                        grades.length > 0 && (
                                                            grades.map((obj) => {
                                                                const { _id, name } = obj
                                                                return (
                                                                    <option value={name} key={_id}>{name}</option>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <div className="select-box">
                                                <label className="drop-text" htmlFor="drop-down3">Subject</label>
                                                <select id="drop-down3" value={subject} className="frm-drop" onChange={(e) => subjectState(e.target.value)}>
                                                    <option value=""></option>
                                                    {
                                                        subjects.length > 0 && (
                                                            subjects.map((obj) => {
                                                                const { _id, name } = obj
                                                                return (
                                                                    <option value={name} key={_id}>{name}</option>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <div className="select-box">
                                                <label className="drop-text" htmlFor="drop-down4">Group</label>
                                                <select id="drop-down4" value={group} className="frm-drop" onChange={(e) => groupState(e.target.value)}>
                                                    <option value=""></option>
                                                    {
                                                        groups.length > 0 && (
                                                            groups.map((obj) => {
                                                                const { _id, name } = obj
                                                                return (
                                                                    <option value={name} key={_id}>{name}</option>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <div className="select-box">
                                                <InputBox placeText="Teacher's Reg. Code" dataList="teachers-reg" defaultValue={teacherReg} type="text" inputState={teacherRegState} />
                                                <datalist id="teachers-reg">
                                                    {
                                                        teachers.length > 0 && (
                                                            teachers.map((obj) => {
                                                                const { _id, regNum } = obj
                                                                return (
                                                                    <option value={regNum} key={_id}>{regNum}</option>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </datalist>
                                            </div>
                                            <SubmitBtn clickFunc={!classId ? classCreateHandler : classUpdateHandler} text={!classId ? "Add a Class" : "Update a Class"} />
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
                                        <InputBox placeText="Search Classes..." inputState={classSearchHandler} />
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                {
                                                    userType === "Owner" || userType === "Manager" ? (
                                                        <>
                                                            <th>#</th>
                                                            <th>Grade</th>
                                                            <th>Subject</th>
                                                            <th>Group</th>
                                                            <th>Teacher's Reg. Code</th>
                                                            <th>Teacher's Full Name</th>
                                                            <th>Creation Date</th>
                                                            <th>Students</th>
                                                            <th>Assignments</th>
                                                            <th>Meetings</th>
                                                            <th>Edit</th>
                                                            <th>Delete</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th>#</th>
                                                            <th>Grade</th>
                                                            <th>Subject</th>
                                                            <th>Group</th>
                                                            <th>Teacher's Reg. Code</th>
                                                            <th>Teacher's Full Name</th>
                                                            {
                                                                userType === "Teacher" && (
                                                                    <>
                                                                        <th>Creation Date</th>
                                                                        <th>Students</th>
                                                                    </>
                                                                )
                                                            }
                                                            <th>Assignments</th>
                                                            <th>Meetings</th>
                                                        </>
                                                    )
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                classes.length > 0 && (
                                                    classes.map((obj, index) => {
                                                        const { _id, grade, subject, group, teacherReg, tcl, createdAt } = obj
                                                        if (userType === "Owner" || userType === "Manager") {
                                                            return (
                                                                <tr key={_id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{grade}</td>
                                                                    <td>{subject}</td>
                                                                    <td>{group}</td>
                                                                    <td>{teacherReg}</td>
                                                                    <td>{tcl && tcl.length ? `${tcl[0].firstName} ${tcl[0].lastName}` : "None"}</td>
                                                                    <td>{createdAt}</td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("student")
                                                                        classIdState(_id)
                                                                    }}>Students</a></td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("assignment")
                                                                        classIdState(_id)
                                                                    }}>Assignments</a></td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("meeting")
                                                                        classIdState(_id)
                                                                    }}>Meetings</a></td>
                                                                    <td className="td-btn td-edit"><a onClick={(e) => {
                                                                        setClassId(_id)
                                                                        oneClassFetchHandler(_id)
                                                                    }}>Edit</a></td>
                                                                    <td className="td-btn td-del"><a onClick={(e) => classDeleteHandler(e, _id)}>Delete</a></td>
                                                                </tr>
                                                            )
                                                        }
                                                        else if (userType === "Teacher" && regCode === teacherReg) {
                                                            count++
                                                            return (
                                                                <tr key={_id}>
                                                                    <td>{count}</td>
                                                                    <td>{grade}</td>
                                                                    <td>{subject}</td>
                                                                    <td>{group}</td>
                                                                    <td>{teacherReg}</td>
                                                                    <td>{tcl && tcl.length ? `${tcl[0].firstName} ${tcl[0].lastName}` : "None"}</td>
                                                                    <td>{createdAt}</td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("student")
                                                                        classIdState(_id)
                                                                    }}>Students</a></td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("assignment")
                                                                        classIdState(_id)
                                                                    }}>Assignments</a></td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("meeting")
                                                                        classIdState(_id)
                                                                    }}>Meetings</a></td>
                                                                </tr>
                                                            )
                                                        }
                                                        else if (userType === "Student") {
                                                            count++
                                                            return (
                                                                <tr key={_id}>
                                                                    <td>{count}</td>
                                                                    <td>{grade}</td>
                                                                    <td>{subject}</td>
                                                                    <td>{group}</td>
                                                                    <td>{teacherReg}</td>
                                                                    <td>{tcl && tcl.length ? `${tcl[0].firstName} ${tcl[0].lastName}` : "None"}</td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("assignment")
                                                                        classIdState(_id)
                                                                    }}>Assignments</a></td>
                                                                    <td className="td-btn td-view"><a onClick={(e) => {
                                                                        displaySec("meeting")
                                                                        classIdState(_id)
                                                                    }}>Meetings</a></td>
                                                                </tr>
                                                            )
                                                        }
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

export default Classes