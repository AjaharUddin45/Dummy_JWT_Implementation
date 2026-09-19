const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    
    email:{
        type:String,
        required:true,
        lowercase:true,// add whatever email user enter in lowercase
        unique:true,
        trim:true,//removes all the space 
       
    },
    password:{
        type:String,
        required:true,
        
    }
},{timestamps:true});

const User = mongoose.model("User",userSchema);
module.exports = User;