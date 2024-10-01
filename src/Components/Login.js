import React, { useState } from "react";
import axios from "axios";

function Login(){

    const [login, setLogin] = useState({
        email:"",
        password: ""
    });

    function handleLogin(e){
        const name = e.target.name;
        let value = e.target.value;
        setLogin({
            ...login,
            [name]: value
        })
   

    }

    function logTheUserIn(e){
        e.preventDefault()

        const verification = {
            email: login.email,
            password: login.password
        }
        axios.post("http://localhost:5001/login", verification)
        .then(res =>console.log(res.data))
        .catch(error =>console.error("There is an error..!", error))


    }


    return(<>
        <form onSubmit={logTheUserIn}>
            <div className="registration-form loginContainer">
            <h1>Login</h1>
                <div>
                    <label>Email</label>
                    <input placeholder="enter your registration email..."
                     onChange={handleLogin}
                     name="email"
                     type="email">

                    </input>
                </div>
                <div>
                    <label>Password</label>
                    <input placeholder="enter your password..." size={50} onChange={handleLogin}
                    name="password"
                    type="password"
                    className="loginPasswordInput"
                    autoComplete="off"
                    ></input>
                </div>
                <div>
                <button className="registration-button">Login</button>

                </div>
            </div>
        </form>
    </>)
}


export default Login;