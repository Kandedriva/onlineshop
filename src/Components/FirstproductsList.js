import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";


function FirstProductsList(){

     const [producList, setProductList] = useState([]);

     const navigate = useNavigate()

     useEffect(() => {  
        axios.get("http://localhost:5001/products", { withCredentials: true })
        .then(res =>{
            setProductList(res.data.productsList)
        })
        .catch(error =>console.log(error));
    }, []);


    function addToCart(e){
        e.preventDefault()

        navigate("/register")



    }



    return(<>
    <Navbar/>
   
    {
        producList.map(product=>(
            <form key={product.productid} onSubmit={addToCart}>
            <div className="Product-container">
            <img src={product.productimage}></img>
            <h3>{product.productname}</h3>
            <p>{product.productdescription}</p>
            <p className="single-price"> ${product.productprice}</p>
            <button className="cart-button" onClick={()=>console.log(product.productname)}>Add to cart</button>
            </div>
            </form>
      
             ))
    }


    </>)
}


export default FirstProductsList;