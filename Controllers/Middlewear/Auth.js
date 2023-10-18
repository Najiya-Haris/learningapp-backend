import jwt from "jsonwebtoken";


import dotenv from "dotenv";
import User from "../../Models/userModel.js";

dotenv.config();

export const userAuth = async (req, res, next) => {
  try {

    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWTUSERSECRET);
      console.log(decoded,'decoded');
      const user = await User.findOne({
        _id: decoded.userId,
      });
      console.log(user,'user');
      if (user) {
        if (user.is_block === false) {
          next();
        } else {
          return res
            .status(403)
            .json({ data: { message: "You are blocked by admin " } });
        }
      } else {
        return res
          .status(400)
          .json({ message: "user not authorised or inavid user" });
      }
    } else {
      return res.status(400).json({ message: "user not authorised" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


export const adminAuth = async (req, res, next) => {
  try {
    console.log('gd');
    console.log(req.headers.authorization);
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWTKEY);
      const admin = await User.findOne({
        _id: decoded.adminId,
        is_admin: true,
      });
      if (admin) {
        next();
      } else {
        return res
          .status(400)
          .json({ message: "user not authorised or inavid user" });
      }
    } else {
      return res.status(400).json({ message: "user not authorised" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
