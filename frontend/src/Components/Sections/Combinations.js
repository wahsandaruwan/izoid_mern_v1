import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Combinations = () => {
    // Combination data states
    const [combinations, setCombinations] = useState("")
    const [combinationId, setCombinationId] = useState("")
    const [grade, setGrade] = useState("")
    const [subject, setSubject] = useState("")
    const [group, setGroup] = useState("")
    const [teacherReg, setTeacherReg] = useState("")
    const [studentReg, setStudentReg] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Grade data state
    const [grades, setGrades] = useState("")

    // Subject data state
    const [subjects, setSubjects] = useState("")

    // Group data state
    const [groups, setGroups] = useState("")

    // Teacher data state
    const [teachers, setTeachers] = useState("")

    // Student data state
    const [students, setStudents] = useState("")

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
    const gradeState = (newVal) => {
        setError("")
        setSuccess("")
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

    const studentRegState = (newVal) => {
        setError("")
        setSuccess("")
        setStudentReg(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setGrade("")
        setSubject("")
        setGroup("")
        setTeacherReg("")
        setStudentReg("")

        // Clear selected teacher id
        setCombinationId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        combinationsFetchHandler()
    }

    // Combinations fetch handler
    const combinationsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3300/api/combinations/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setCombinations(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    // Handle fetching all data
    useEffect(() => {
        combinationsFetchHandler()
        gradesFetchHandler()
        subjectsFetchHandler()
        groupsFetchHandler()
        teachersFetchHandler()
        studentsFetchHandler()
    }, [])

    // Create combination handler
    const combinationCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`http://localhost:3300/api/combinations/create`, {
                grade: grade,
                subject: subject,
                group: group,
                teacherReg: teacherReg,
                studentReg: studentReg
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                combinationsFetchHandler()

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

    // Get a combination by id handler
    const oneCombinationFetchHandler = async (combinationId) => {
        // Api call
        try {
            const { data } = await axios.get(`http://localhost:3300/api/combinations/${combinationId}`, configCommon)

            if (data.authEx) {
                alert(data.errors.message)

                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setGrade(data.grade)
                setSubject(data.subject)
                setGroup(data.group)
                setTeacherReg(data.teacherReg)
                setStudentReg(data.studentReg)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Update a combination handler
    const combinationUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`http://localhost:3300/api/combinations/${combinationId}`, {
                grade: grade,
                subject: subject,
                group: group,
                teacherReg: teacherReg,
                studentReg: studentReg
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                combinationsFetchHandler()

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

    // Delete a combination handler
    const combinationDeleteHandler = async (e, combinationId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this combination?")) {
            // Api call
            try {
                const { data } = await axios.delete(`http://localhost:3300/api/combinations/${combinationId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    combinationsFetchHandler()
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

    // Search a combination by a query handler
    const teacherSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`http://localhost:3300/api/combinations/search/${query}`, configCommon)
                setCombinations(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            combinationsFetchHandler()
        }
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

    // Subjects fetch handler
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

    // Groups fetch handler
    const groupsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3300/api/groups/`, configCommon)
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
            const { data } = await axios.get(`http://localhost:3300/api/teachers/`, configCommon)
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

    // Students fetch handler
    const studentsFetchHandler = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3300/api/students/`, configCommon)
            if (data.authEx) {
                alert(data.errors.message)
                // Clear local storage
                localStorage.clear()
                history.push("/")
            }
            else {
                setStudents(data)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <>
            <div className="data-content">
                <div>
                    <div className="data-form">
                        <h2>Manage Combinations</h2>
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
                            <div className="select-box">
                                <InputBox placeText="Student's Reg. Code" dataList="students-reg" defaultValue={studentReg} type="text" inputState={studentRegState} />
                                <datalist id="students-reg">
                                    {
                                        students.length > 0 && (
                                            students.map((obj) => {
                                                const { _id, regNum } = obj
                                                return (
                                                    <option value={regNum} key={_id}>{regNum}</option>
                                                )
                                            })
                                        )
                                    }
                                </datalist>
                            </div>
                            <SubmitBtn clickFunc={!combinationId ? combinationCreateHandler : combinationUpdateHandler} text={!combinationId ? "Add a Combination" : "Update a Combination"} />
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
                                <InputBox placeText="Search Combinations..." inputState={teacherSearchHandler} />
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Grade</th>
                                        <th>Subject</th>
                                        <th>Group</th>
                                        <th>Teacher's Reg. Code</th>
                                        <th>Student's Reg. Code</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        combinations.length > 0 && (
                                            combinations.map((obj, index) => {
                                                const { _id, grade, subject, group, teacherReg, studentReg } = obj
                                                return (
                                                    <tr key={_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{grade}</td>
                                                        <td>{subject}</td>
                                                        <td>{group}</td>
                                                        <td>{teacherReg}</td>
                                                        <td>{studentReg}</td>
                                                        <td className="td-btn td-edit"><a onClick={(e) => {
                                                            setCombinationId(_id)
                                                            oneCombinationFetchHandler(_id)
                                                        }}>Edit</a></td>
                                                        <td className="td-btn td-del"><a onClick={(e) => combinationDeleteHandler(e, _id)}>Delete</a></td>
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

export default Combinations