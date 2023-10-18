// Import required modules 
import express from 'express';
import cors from 'cors';
import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from './Routes/User/userRoutes.js';
import adminRoute from './Routes/Admin/adminRoutes.js';
dotenv.config();
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.set("strictQuery", true);


app.use(cors());



mongoose.connect(process.env.mongo,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('mogodb connected');
}).catch(err=>{
    console.log(err.message);
})

app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(process.env.port,()=>{
    console.log(`server connected ${process.env.port}`);
})


