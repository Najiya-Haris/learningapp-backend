import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import  Token  from '../Models/token.js';

import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"
import { request } from "http";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const generateOtp=()=>{
  try {
    let otp=''
    for(let i=0;i<4;i++){
     const random=Math.round(Math.random()*9);
     otp=otp+random
    }
    return otp.toString()
  } catch (error) {
    console.log(error.message);
  }
}

const userRegister = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const exist = await userModel.findOne({email:email});
    console.log(exist);
    if (exist) {
      return res.status(200).json({register:false, message:"User already exists" });
    }else{
      const hashpass = await bcrypt.hash(password, 10);
    const user = new userModel({
      userName,
      email,
      password: hashpass,
    });
    const userData = await user.save();

  //  const token=await new Token({
  //   userId:user._id,
  //   token:crypto.randomBytes(32).toString("hex")

  //  }).save();
   console.log(process.env.BASE_URL);
   const OTP=generateOtp()
   console.log(OTP,'otp');
   const tokendata=await new Token({
    userId:user._id,
    token:OTP
   }).save()
   let subject='Verify Email'
   let text=`<div>
    <h1>OTP for verification</h1>
    <p>${OTP}</p>
   </div>`
    await sendEmail(user.email,subject,text)
    res.status(200).json({message:"an email sent to your account,please verify",register:true,id:user._id})
    
    
    }
  
  
  } catch (error) {
    console.error("Error Registering", error);
    res.status(500).json({ message: "Server error at registration" });
  }
};

export const Login = async (req, res) => {
  console.log("yeaaah")
  try {
    const { email, password } = req.body;
    const existUser = await userModel.findOne({ email: email });
    if (!existUser) {
      console.log('existing')
      return res.status(201).json({access:false, message: "User Not Found" });
    }
    if (existUser.is_block === true) {
      return res
        .status(201)
        .json({ access: false, message: "You are blocked by admin" });
    }
    const passwordMatch = await bcrypt.compare(password, existUser.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(201).json({access:false, message: "Password didn't match" });
    }
    
    const token = jwt.sign({ user: existUser._id }, "kkkkkkkkkkkkk", {
      expiresIn: "1h",
    });
    res.status(200).json({
      access:true,
      message: "Login Successful",
      name: existUser?.name,
      data: existUser,
      token,
      role: "user",
      id: existUser._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errMsg: "Something Went Wrong" });
  }
};

export const googleSignUp=async(req,res)=>{
  try{
    const {data}=req.body;
    console.log(data);
    const { name, email, id } = data;
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      console.log('existing')
      return res.status(201).json({access:false, message:"user aleady exist" });
    }

    const hashpass = await bcrypt.hash(id, 10);
    const user = new userModel({
      userName:name,
      email,
      password: hashpass,
    });
    await user.save();
    console.log("user Inserted");
    const token = jwt.sign({userId:user._id},process.env.JWTKEY)
    res.status(200).json({access:true, message: "User registered Successfully",user,token});
  }catch(error){
    console.log(error)
    res.status(500).json({errMsg:"Something Went Wrong"})
  }
}

export const verifyOtp=async(req,res)=>{
  try{
    const user=await User.findOne({_id:req.params.id})
    if(!user){
    return res.status(400).json({message:"invalid link"})
  }
    const token=await Token.findOne({
      userId:user_id,
      token:req.params.token
    })
    if(!token){
      return res.status(400).json({message:"invalid link"})
    }
      await User.updateOne({_id:user._id},{$set:{is_verified:true}});
      await token.deleteOne({token:request.params.token})
      res.status(200).json({message:"email verifaid successfully"})
    }
  catch(error){
    console.log(error);

  }
}
export const getUser = async (req, res, next) => {
  try {
    
    const id = req.params.id;
    const data = await User.findById(id);
    if (data) {
      return res.status(200).json({ data: data });
    } else {
      return res.status(200).json({ message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const editProfile=async(req,res)=>{
  try{
   console.log(req.body);
   let user=await User.findByIdAndUpdate(req.body.id,{$set:{userName:req.body.username}});
return res.status(200).json({data:user,status:true})
   
  }catch(error){
    console.log(error.message);

  }
}
export const editImage=async(req,res)=>{
  try{
   console.log(req.body)
   const{id}= req.params
   const uploadedImages = await uploadToCloudinary(req.file.path, "image");
   console.log(uploadedImages);
   let imageUrl=uploadedImages.url;
   let user=await User.findByIdAndUpdate(id,{$set:{image:imageUrl}})
   return res.status(200).json({user})
   
  }catch(error){
    console.log(error.message);

  }
}


export const verifyEmail=async(req,res)=>{
  try {
    const {id,otp}=req.body
    const token = await Token.findOne({ userId: id })
    if(otp==token.token){
      await User.findByIdAndUpdate(id,{$set:{verified:true}})
    }else{
      return res.status(200).json({message:"otp incorrect",status:false})
    }
    
    res.status(200).json({status:true,alert:'user verifed'})
  } catch (error) {
    console.log(error.message);
  }
}

export default userRegister;
