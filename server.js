import express from "express";  
import dotenv from "dotenv";
import ImportData from "./DataImport.js";
import connectDatabase from "./configure/mongoConf.js";
import productRoute from "./Routes/productRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";   
import orderRouter from "./Routes/orderRoutes.js";
import orderRouterV from "./Routes/orderRoutesV.js";
import orderRouters from "./Routes/orderRoutess.js";


 
dotenv.config();
connectDatabase();
const app = express(); 
app.use(express.json());

 
app.use("/api/import/",ImportData);
app.use("/api/products/",productRoute); 
app.use("/api/users",userRouter);
app.use("/api/orders",orderRouter);
app.use("/api/ordersV",orderRouterV);
app.use("/api/orderss",orderRouters);

app.get("/api/config/paypal",(req, res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID);
});




app.use(notFound);
app.use(errorHandler);


app.get("/",(req,res) =>{
    res.send("API Is Running");
});

const PORT =8080;


app.listen(PORT, console.log(`server run in port ${PORT}`));


 


