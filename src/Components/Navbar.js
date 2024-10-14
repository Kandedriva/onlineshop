import React from "react";
import { Link } from "react-router-dom";


function Navbar() {


    return (<>
        <div>
            <Link to="/register">Register</Link>
            <Link to="/Login">Login</Link>
            <Link to="/Products">Products</Link>
        </div>
    </>)
}

export default Navbar;