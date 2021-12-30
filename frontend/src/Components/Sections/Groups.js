import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Groups = () => {
    // Groups data states
    const [groups, setGroups] = useState("")
    const [groupId, setGroupId] = useState("")
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

        // Clear selected group id
        setGroupId("")

        // Clear error and success
        setError("")
        setTimeout(() => {
            setSuccess("")
        }, 3000)

        groupsFetchHandler()
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

    // Handle fetching all groups
    useEffect(() => {
        groupsFetchHandler()
    }, [])

    // Create group handler
    const groupCreateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.post(`http://localhost:3300/api/groups/create`, {
                name: name
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                groupsFetchHandler()

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

    // Get a group by id handler
    const oneGroupFetchHandler = async (groupId) => {
        // Api call
        try {
            const { data } = await axios.get(`http://localhost:3300/api/groups/${groupId}`, configCommon)

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

    // Update a group handler
    const groupUpdateHandler = async (e) => {
        e.preventDefault()

        // Api call
        try {
            const { data } = await axios.put(`http://localhost:3300/api/groups/${groupId}`, {
                name: name
            }, configPost)

            if (data.created) {
                setError("")
                setSuccess(data.success.message)
                groupsFetchHandler()

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

    // Delete a group handler
    const groupDeleteHandler = async (e, groupId) => {
        e.preventDefault()

        if (window.confirm("Are you really want to delete this group?")) {
            // Api call
            try {
                const { data } = await axios.delete(`http://localhost:3300/api/groups/${groupId}`, configCommon)

                if (data.created) {
                    alert(data.success.message)
                    groupsFetchHandler()
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

    // Search a group handler by a query
    const groupSearchHandler = async (query) => {
        if (query) {
            try {
                const { data } = await axios.get(`http://localhost:3300/api/groups/search/${query}`, configCommon)
                setGroups(data)
            } catch (err) {
                alert(err.message)
            }
        }
        else {
            groupsFetchHandler()
        }
    }

    return (
        <>
            <div className="search-sec">
                <InputBox placeText="Search Groups..." inputState={groupSearchHandler} />
            </div>
            <div className="data-content">
                <div>
                    <div className="data-form">
                        <h2>Manage Groups</h2>
                        <form>
                            <InputBox placeText="Name" defaultValue={name} type="text" inputState={nameState} />
                            <SubmitBtn clickFunc={!groupId ? groupCreateHandler : groupUpdateHandler} text={!groupId ? "Add a Group" : "Update a Group"} />
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
                                        groups.length > 0 && (
                                            groups.map((obj, index) => {
                                                const { _id, name } = obj
                                                return (
                                                    <tr key={_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{name}</td>
                                                        <td className="td-btn td-edit"><a onClick={(e) => {
                                                            setGroupId(_id)
                                                            oneGroupFetchHandler(_id)
                                                        }}>Edit</a></td>
                                                        <td className="td-btn td-del"><a onClick={(e) => groupDeleteHandler(e, _id)}>Delete</a></td>
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

export default Groups
