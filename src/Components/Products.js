import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";


function Products(){

    const [products, setProduct] = useState([]);

    useEffect(() => {  
        axios.get("http://localhost:5001/products")
        .then(res =>{
            setProduct(res.data)
          console.log(res.data)
        })
        .catch(error =>console.log(error));
    }, []);
  
    useEffect(() => {
        console.log(products); // Logs products whenever they are updated
    }, [products]);

    return (<>
    {
        products.map(product=>(
       <div key={product.productid} className="Product-container">
       <img src={product.productimage}></img>
       <h3>{product.productname}</h3>
       <p>{product.productdescription}</p>
       <p className="single-price"> ${product.productprice}</p>
       <button className="cart-button">Add to cart</button>
       </div>

        ))
    }

    </>)
}

export default Products;