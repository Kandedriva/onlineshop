import React from "react";
import { useState } from "react";
import axios from "axios";


function Register(){

    const [registration, setRegitration] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    })

    function handlinput(e){
        const name = e.target.name;
        let value = e.target.value;
        setRegitration({
            ...registration,
            [name]: value
    })


    }

    function handleRegistration(e){
        e.preventDefault();

        const newUser ={
            firstname: registration.firstname,
            lastname: registration.lastname,
            email: registration.email,
            password: registration.password
        }

        axios.post("http://localhost:5001/registration", newUser)
        .then(res =>console.log(res.data))
        .catch(error =>console.error("There is an error..!", error))
    }

    return(
        <>
            <form onSubmit={handleRegistration}>
                <div className="registration-form">
                <h1>Registration</h1>
                    <div className="registration-caption">
                        <label>Fist name</label><br></br>
                        <input placeholder="enter your first name" type="text" name="firstname" onChange={handlinput}  autoComplete="off"></input>
                    </div>
                    <div className="registration-caption">
                        <label className="label">Last name</label><br></br>
                        <input placeholder="enter your last name" type="text" name="lastname" onChange={handlinput}  autoComplete="off"></input>
                    </div>
                    <div className="registration-caption">
                        <label>Email</label><br></br>
                        <input placeholder="enter your email"  type="email" name="email" onChange={handlinput}  autoComplete="off"></input>
                    </div>
                    <div className="registration-caption">
                        <label>Choose a password</label><br></br>
                        <input placeholder="choose a password"  type="password" name="password" onChange={handlinput}  autoComplete="off"></input>
                    </div>
                   <div>
                   <button className="registration-button">Register</button>
                   </div>
                   <div>
                   <p>Or if your already have an account, </p>
                    <button>Login here</button>
                   </div>
                </div>
            </form>
        </>
    )
}
export default Register;