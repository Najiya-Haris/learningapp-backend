import express from 'express'
import user from '../../Models/userModel.js';
import login, { addcourse, getCourses,deleteCourse } from '../../Controllers/adminControllers.js';
import {userlist} from '../../Controllers/adminControllers.js';
import {manageuser,editcourse} from  '../../Controllers/adminControllers.js';
import upload from '../../Controllers/Middlewear/multer.js';


const adminRoute=express.Router();

adminRoute.post('/login',login);
adminRoute.get('/users',userlist)
adminRoute.put('/manageuser/:id',manageuser)
adminRoute.post('/addcourse',upload.single('image'),addcourse)
adminRoute.get('/course',getCourses)
adminRoute.delete('/delete/:id',deleteCourse)
adminRoute.post("/editcourse",editcourse)
export default adminRoute;
