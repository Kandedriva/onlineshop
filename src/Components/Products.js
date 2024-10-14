import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";


function Products(){

    const [products, setProduct] = useState([]);
    const [getUser, setGetUser] = useState({});

    useEffect(() => {  
        axios.get("http://localhost:5001/products", { withCredentials: true })
        .then(res =>{
            setProduct(res.data.productsList)
            setGetUser(res.data.loggedUser)
            // console.log(res.data.loggedUser)

  
        })
        .catch(error =>console.log(error));
    }, []);

    // useEffect(() => {
    //     console.log("Updated user:", getUser);  // This will show the updated user
    // }, [getUser]);

    function addToCart(e){
        e.preventDefault();
        console.log("I'm ready to add the product the the cart...!")
    }

  


    return (<>
    {getUser?.firstname && <h1>Welcome, {getUser.firstname}</h1>}  
    {
        products.map(product=>(
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

export default Products;