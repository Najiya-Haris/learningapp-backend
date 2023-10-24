import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    is_delete:{
        type:Boolean,
        default:false,
    },  price:{
        type:Number,
        required:true
    },description:{
        type:String,
    },teacherimage:{
        type:String,
    },
    techername:{
            type:String,
        },
        teacherdetails:{
            type:String,
        },
        reviwes:{
            type:String
        }

    }
 
);

const Course = mongoose.model('Course',courseSchema);

export default Course;
