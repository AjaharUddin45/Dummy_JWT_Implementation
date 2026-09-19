
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user.js");
const {validateSignUpData} = require("./utils/validateUser.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());//to parse cookie and read it in req.body

app.post("/signup",async (req,res)=>{
    const {name,email,password} = req.body;

    try{
        //Validate signUp data sent by user
        validateSignUpData(req);

        //bcrypt password 
        const passwordHash = await bcrypt.hash(password,10);
        console.log("Hassedpassword : ", passwordHash);


        const user = await User.create({
                name,
                email,
                password:passwordHash,
        });
        res.send("User added successfully!!!",user);
        console.log(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    
});

//login
app.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    try {
         if(!email){
         return res.status(400).send("Email is required!!!");
    }else if(!password){
        return res.status(400).send("please enter correct password!!!");

    }
    
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).send("EmailId is not present in the Database!!!");
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(password,user.password);
    // console.log(password);
    // console.log(user.password);
    if(isPasswordValid){
        //create a jwt token
        const token = await jwt.sign({_id:user._id,name:user.name},"DheerajSenger@#$1234",{ expiresIn: "7d" });
        console.log(token);
        //Add the token to the cookies and send back the response to the user
        res.cookie("token",token,{expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
        res.send("Login successfull!!!");
    }else{
      return res.status(400).send("password is not correct!!!");
    }
    
    } catch (err) {
        console.log(err);
        res.status(400).send("Error : "+ err.message);
    }
   
});

//profile
app.get("/profile",async (req,res)=>{
    try {
         const cookies = req.cookies;
         const {token} = cookies;
    
    //validate my token
    const decodedMessage = await jwt.verify(token, "DheerajSenger@#$1234");
    const {_id} = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User does not exist");
    }

    res.send(user);
   
    } catch (err) {
         console.log(err);
        res.status(400).send("Error : "+ err.message);
    }
    
   
});




app.get("/user", async(req,res)=>{
    try{
    const {email} = req.body;
    const getUser =  await User.findOne({email});
    if(!getUser){
        res.status(400).send("user Not found");
    }else{
         res.send(getUser);
    console.log(getUser);
    }
   
    }catch(err){
        console.log(err);
    }
    
});

//update user
app.patch("/user",async(req,res)=>{
    const {id,name} = req.body;
    
    try {
        const UpdatedUser = await User.findByIdAndUpdate(id,{name},{
            
            new:true,
            runValidator:true,
        });
        console.log(UpdatedUser);
        res.send("User updated successfully!!!");

    } catch (err) {
        console.log(err);
    }
});


//delete user
app.delete("/user",async (req,res)=>{
    try{
        const {id} = req.body;
        console.log("_id : ",id);
        const deletedUser = await User.findByIdAndDelete(id);
        res.send("User Deleted successfully!!");
    }catch(err){
        console.log(err);
    }
});




async function main(){
     await mongoose.connect("mongodb://localhost:27017/devTinder");
}
main().then(()=>{
    console.log("connection to DB successfull!!");
    app.listen(7329,()=>{
    console.log("App is listening on port 7329");
});
}).catch((err)=>{
    console.log(err);
});





