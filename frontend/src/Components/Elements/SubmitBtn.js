const SubmitBtn = ({ text, clickFunc }) => {
    return (
        <>
            <a className="su-btn" onClick={(e) => clickFunc(e)}>{text}</a>
        </>
    )
}

export default SubmitBtn
