import React from "react";
import { Link } from "react-router-dom";


function Navbar() {


    return (<>
        <div className="navbar">
        <h1 className="firstList-title">Welcome to Afrizone</h1>
            <Link className="navigationLink" to="/"></Link>
            <Link className="navigationLink" to="/register">Register</Link>
            <Link className="navigationLink" to="/Login">Login</Link>
            
        </div>
    </>)
}

export default Navbar;