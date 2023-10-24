import userModel from "../Models/userModel.js";
import token from "../Models/token.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { response } from "express";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import Course from "../Models/courseModel.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await userModel.findOne({ email });
    if (!admin)
      return res
        .status(201)
        .json({ access: false, message: "admin not found" });

    const isCorrect = bcrypt.compareSync(password, admin.password);
    if (!isCorrect)
      return res
        .status(201)
        .json({ access: false, message: "Wrong password or username!" });

    if (admin.is_admin === false) {
      return res
        .status(201)
        .json({ access: false, message: "You are not admin!!!" });
    } else {
      const token = jwt.sign({ userId: admin._id }, process.env.JWTKEY, {
        expiresIn: 86400000,
      });

      const { pass, ...info } = admin._doc;
      return res
        .status(200)
        .json({ access: true, token, info, message: "Logged in successfully" });
    }
  } catch (err) {
    next(err);
  }
};

export const userlist = async (req, res) => {
  try {
    let users = await userModel.find();
    if (!users) {
      return res.send("no data");
    } else {
      return res.json({ users });
    }
  } catch (error) {
    console.log(error);
  }
};
export const addcourse=async(req,res)=>{
  try {
    console.log("add co tr")
    const {name,about,image,price}=req.body

   //console.log(name,about,price,image);
    // const uploadedImages = await uploadToCloudinary(req.file.path, "image");
    // console.log();
    // new Course({
    //   courseName:name,
    //   description:about,
    //   image:image,
    //   price:price,
    //   // content:content
    // }).save()
    const newCourse = new Course({
      courseName: name,
      description: about,
      image: image,
      price: price,
    });

    // Save the new course to the database
    await newCourse.save();
    return res.status(200).json({message:"Course added Successfully",status:true})

  } catch (error) {
    console.log(error);
    
  }
}
export const deleteCourse=async(req,res)=>{
  try{
console.log("hjbjnm");
    const courseid=req.params.id
 
    const course=await Course.findById(courseid)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const updateCourse = await Course.updateMany({_id:courseid},{$set:{is_delete:true}})
    console.log(updateCourse)
    if(updateCourse){
      return res.status(204).json({message:"course deleted successfully",status:true})
    }else{
      return res.status(400).json({message:"course deleting failed",status:false})
    }

    

  }catch(error){
    console.log(error);
  }
}

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({is_delete:false}); 

    return res.status(200).json({ courses, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', status: false });
  }
};
export const editcourse = async (req, res) => {
  try {
    console.log('edit');
    const { id, coursename, price,about } = req.body;

    let course = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          courseName: coursename,
          price: price,
          description: about,
        }
      },
      { new: true } // This option ensures that the updated document is returned
    );

    return res.status(200).json({ data: course, status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'An error occurred.' });
  }
}



export const manageuser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.send("user not found");
    } else {
      const mm = await userModel.updateOne(
        { _id: id },
        { $set: { is_block: !user.is_block } }
      );

      return res.status(200).json({
        message: user.is_block ? "user blocked" : "user unblocked",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default login;
