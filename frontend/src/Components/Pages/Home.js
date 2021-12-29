import InputBox from "../Elements/InputBox"
import SubmitBtn from "../Elements/SubmitBtn"

const Home = () => {
    return (
        <>
            <section className="main-sec">
                <div className="home-content">
                    <h1 className="heading">Welcome to Izoid Center Portal</h1>
                    <div className="lg-frm">
                        <h2>Login</h2>
                        <form action="">
                            <InputBox placeText="Registration Number" type="text" />
                            <InputBox placeText="Password" type="password" />
                            <SubmitBtn text="Login" />
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
