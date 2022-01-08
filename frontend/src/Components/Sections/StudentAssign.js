import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"
import Loader from "../Elements/Loader"

const StudentAssign = ({ clsId }) => {
    // Student data states
    const [students, setStudents] = useState("")
    const [studentReg, setStudentReg] = useState("")
    const [studentsOfCls, setStudentsOfCls] = useState("")
    const [searchResult, setSearchResult] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Loading state
    const [loading, setLoading] = useState(true)

    // Get jwt from local storage
    const userLoginData = localStorage.getItem("userLogin")
    let jwt = ""
    let userType = ""
    if (userLoginData) {
        const { token, type } = JSON.parse(userLoginData)
        jwt = token
        userType = type
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
    const studentRegState = (newVal) => {
        setError("")
        setSuccess("")
        setStudentReg(newVal)
    }

    // Clear all
    const clearAll = (e) => {
        e.preventDefault()

        // Clear input fields
        setStudentReg("")

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
            studentsFetchHandler()
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
                setSearchResult(data[0].scl)
                setStudentsOfCls(data[0].scl)
                setLoading(false)
            }
        } catch (err) {
            setSuccess("")
            setError(err.message)
        }
    }

    // Assign student handler
    const assignStudentHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}classes/student/${clsId}`, {
                studentReg: studentReg
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

    // Students fetch handler
    const studentsFetchHandler = async () => {
        // Api call
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_PREFIX}students/`, configCommon)
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

    // Delete student handler
    const studentDeleteHandler = async (e, studentReg) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this student from this class?")) {
            // Api call
            try {
                const { data } = await axios.put(`${process.env.REACT_APP_API_PREFIX}classes/student/delete/${clsId}`, {
                    studentReg: studentReg
                }, configPost)

                if (data.created) {
                    alert(data.success.message)
                    oneClassFetchHandler()

                    // Clear all
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

    // Search student handler
    const searchStudentHandler = (query) => {
        if (query) {
            let result = searchResult.filter((el) => {
                if (el.regNum.toLowerCase().includes(query.toLowerCase()) || el.firstName.toLowerCase().includes(query.toLowerCase()) || el.lastName.toLowerCase().includes(query.toLowerCase())) {
                    return el.regNum
                }
            })
            console.log(result)
            setStudentsOfCls(result)
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
                                userType === "Owner" || userType === "Manager" ? (
                                    <div className="data-form">
                                        <h2>Assign Students</h2>
                                        <form>
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
                                            <SubmitBtn clickFunc={assignStudentHandler} text="Assign Student" />
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
                                        <InputBox placeText="Search Assigned Students..." inputState={searchStudentHandler} />
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Student's Registration Code</th>
                                                <th>Student's Full Name</th>
                                                {
                                                    userType === "Owner" || userType === "Manager" ? (
                                                        <th>Delete</th>
                                                    ) : (
                                                        <></>
                                                    )
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                studentsOfCls.length > 0 && (
                                                    studentsOfCls.map((obj, index) => {
                                                        const { _id, regNum, firstName, lastName } = obj
                                                        return (
                                                            <tr key={_id}>
                                                                <td>{index + 1}</td>
                                                                <td>{regNum}</td>
                                                                <td>{`${firstName} ${lastName}`}</td>
                                                                {
                                                                    userType === "Owner" || userType === "Manager" ? (
                                                                        <td className="td-btn td-del"><a onClick={(e) => studentDeleteHandler(e, regNum)}>Delete</a></td>
                                                                    ) : (
                                                                        <></>
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

export default StudentAssign
