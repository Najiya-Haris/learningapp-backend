import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type: String,
        required:true,
    },
    isActive:{
        default:false,
        type:Boolean,
    },
    is_block:{
        type:Boolean,
        default:false
    },
    is_admin:
    {
      type:Boolean,
        default:false
    },
    image:{
        type:String,
        required:true
    }
});

const User = mongoose.model('User',userSchema);

export default User;
