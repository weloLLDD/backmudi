import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"; 
import User from "../models/userModels.js";

 
const protect = asyncHandler(async (req,res,next) =>
  {
    
        let token;

        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
        ) {
          try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password'); 
            console.log(decoded);
            next();

          } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error("User not found");

          }
          console.log("Not authorized, token failed");
        } 
       
        if (!token) {
          res.status(401).json({ message: 'Not authorized, no token' });
          return false;
        }
  

    }
 
  );

  const admin = (req,res, next) =>{
    if(req.user && req.user.isAdmin){
      next()
    } else{
      res.status(401).json("not authorized, as an admin");
      throw new Error("not authorized, as an admin");
    }
  }

export  {admin,protect};
