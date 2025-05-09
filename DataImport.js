import express from "express" 
import User from "./models/userModels.js";
import users from "./data/User.js";
import Product from "./models/productModel.js";
import products from "./data/Products.js";
import asynchandler from "express-async-handler";

const ImportData = express.Router();


ImportData.post("/user",asynchandler(async(req,res) =>{
   
    await User.deleteOne({});
    const importUser = await User.insertMany(users);
    res.send({importUser});
})

);


ImportData.post("/products",asynchandler(async(req,res) =>{
   
    await Product.deleteOne({});
    const importProduct = await Product.insertMany(products);
    res.send({importProduct});
}));



export default ImportData;