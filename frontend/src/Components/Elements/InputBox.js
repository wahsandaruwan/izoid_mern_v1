const InputBox = ({ type, placeText, defaultValue, inputState, dataList }) => {
    return (
        <>
            <input className="inp-box" list={dataList} type={type} placeholder={placeText} value={defaultValue} onChange={(e) => inputState(e.target.value)} />
        </>
    )
}

export default InputBox
