import express from 'express'
import userRegister, { googleSignUp, verifyOtp,verifyEmail, editImage, getCourse, resendotp, getSingle, makepayment, getPaymentData, submitPayment } from '../../Controllers/userController.js';
import user from '../../Models/userModel.js';
import { Login,getUser,editProfile } from '../../Controllers/userController.js';
import upload from '../../Controllers/Middlewear/multer.js';
import { userAuth } from '../../Controllers/Middlewear/Auth.js';




const userRoute = express.Router();

userRoute.post('/signup',userRegister)
userRoute.post('/login',Login)
userRoute.post('/googlesignup',googleSignUp)
userRoute.get("/:id/verify/:token",verifyOtp)
userRoute.get("/resendotp/:id",resendotp)
userRoute.post("/verifyemail",verifyEmail)
userRoute.get('/userprofile/:id',getUser)
userRoute.post("/editprofile",editProfile)
userRoute.post("/uploadImage/:id",upload.single('image'),editImage)
userRoute.get("/course",getCourse)
userRoute.get(`/singlecourse/:id`,getSingle)
userRoute.post(`/submitpayment`,submitPayment)
userRoute.get(`/getpaymentdata/:id`,getPaymentData)
userRoute.post(`/payment`,makepayment)
export default  userRoute;

