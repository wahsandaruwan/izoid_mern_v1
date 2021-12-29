const InputBox = ({ type, placeText, defaultValue, inputState }) => {
    return (
        <>
            <input className="inp-box" type={type} placeholder={placeText} value={defaultValue} onChange={(e) => inputState(e.target.value)} />
        </>
    )
}

export default InputBox
