import express from 'express'
import userRegister, { googleSignUp, verifyOtp,verifyEmail, editImage } from '../../Controllers/userController.js';
import user from '../../Models/userModel.js';
import { Login,getUser,editProfile } from '../../Controllers/userController.js';
import upload from '../../Controllers/Middlewear/multer.js';




const userRoute = express.Router();

userRoute.post('/signup',userRegister)
userRoute.post('/login',Login)
userRoute.post('/googlesignup',googleSignUp)
userRoute.get("/:id/verify/:token",verifyOtp)
userRoute.post("/verifyemail",verifyEmail)
userRoute.get('/userprofile/:id',getUser)
userRoute.post("/editprofile",editProfile)
userRoute.post("/uploadImage/:id",upload.single('image'),editImage)
export default  userRoute;

