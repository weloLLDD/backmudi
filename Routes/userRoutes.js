import express from "express"
import asynHandler from "express-async-handler" 
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";
import { protect,admin } from "../middleware/AuthMiddleware.js";
import { Error } from "mongoose";


const userRouter = express.Router();

//LOGIN
userRouter.post("/login", asynHandler(async(req, res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email})
 
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id),
            createdAt:user.createdAt,
        });

      
        
    } else {
      //  res.status(401);  
      //  throw new Error("Invalid email or Password");
      res.status(401).json("Invalid email or Password");
    }
 
})

);

//register
userRouter.post("/",asynHandler(async(req, res)=>{
     
    const {name,email,password} = req.body;
    
    // verification email si existe 
    const userExists = await User.findOne({email});
   
    if (userExists) {
        res.status(400);
        throw new Error("User already exists")
    }

    // create user

    const user = await User.create({
        name,
        email,
        password,
    });

    if(user){
       res.status(201).json({
         _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        createdAt:user.createdAt,

       })
    } else{
        res.status(400)
        throw new Error("Invalid User Data")
     
    }
    
   }) 
   
   );


//PROFIL
userRouter.get("/profile",protect,asynHandler(async(req, res)=>{
 const user = await User.findById(req.user._id);

 if(user){
    res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        createdAt:user.createdAt,
    });
 } else{
    res.status(404);
    throw new Error("User not found");
 }
 
}) 

);



//UPDATE PROFILE
userRouter.put("/profile",protect,asynHandler(async(req, res)=>{
    const user = await User.findById(req.user._id);
   
    if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if(req.body.password){
        user.password =req.body.password
      }
      const updateUser = await user.save();
      res.json({
        _id: updateUser._id,
        name:updateUser.name,
        email:updateUser.email,
        isAdmin:updateUser.isAdmin,
        createdAt:updateUser.createdAt,
        token:generateToken(updateUser._id),
      })
    } else{
        console.log(user);
       res.status(401);
       throw new Error("User not found");
    }
    
   }) 
   
   );      
   

//  GET ALL USER ADMIN 
userRouter.get("/",protect,admin,asynHandler(async(req, res) =>{
  const users = await User.find({})
  res.json(users);
}))

 export default userRouter
