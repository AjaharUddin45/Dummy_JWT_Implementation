const validator = require("validator");
const validateSignUpData = (req)=>{
    const {name,email,password} = req.body;

    if(!name){
        throw new Error("Name is required!!!");
    }else if(!validator.isEmail(email)){
        throw new Error('Email is not valid!!');
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter strong password!!!");
    }
};

// {// this is default value set for isStrongPassword!!
//                 minLength: 8,
//                 minLowercase: 1,
//                 minUppercase:1,
//                 minNumbers: 1,
//                 minSymbols: 1
//     }

module.exports = {
    validateSignUpData,
}