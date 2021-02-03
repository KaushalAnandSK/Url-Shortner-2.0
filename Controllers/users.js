const User=require('../models/User');
const Validation=require('../Helpers/validate');
const jwt = require('jsonwebtoken');
const passportSetUp = require('../config/passport-setup');


require('dotenv').config();

//Secret
var secretKey=process.env.SECRET_KET;

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email : '', password : ''};
    
    //incorrect email
    if(err.message === 'Incorrect Email'){
        errors.email = "That Email is not registered";
    }

    //incorrect password
    if(err.message === 'Incorrect Password'){
        errors.password = "That Password is not registered";
    }

    //duplicate error code
    if(err.code ===1100){
        errors.email ='that email is already registered';
    }

    //validate errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//Creating Token
const maxToken = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({ id }, secretKey , {expiresIn: maxToken});
}

//Function to register an given user details 

async function registerUser (req,res) {
    const {fName,lName, email, password} =req.body;
    // let page=req.query.page;
    // let limit =req.query.limit;
    try{
        const user = await User.create({fName, lName, email, password});
        const token = createToken(user._id);
        console.log(token);
                    let result = {
                        status : "success",
                        data: {
                            token : token,
                            user : user
                        }
                    }
                    res.status(201).send(result);
        res.status(200).json(result);
    }catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

async function getRegisteredUser (req,res) {
    try{
        const registeredUser = await User.find();
        res.json(registeredUser);
    }catch (err) {
        res.json({ message : err});
    }
};

async function getUserById (req,res) {
    try{
        const uniqueUser = await User.findById(req.params.userId);
        res.json(uniqueUser);
    }catch (err) {
        res.json({ message : err});
    }
};

async function updateUserById (req,res) {
       try{
        const updateUser= await User.updateOne(
            {_id : req.params.userId},
            { $set: { fName: req.body.fName,
                      lName: req.body.lName, 
                      email: req.body.email, 
                      password: req.body.password, 
                      confirmPassword: req.body.confirmPassword
                    }}
        );
        res.json(updateUser);
    }catch (err) {
        res.json({ message : err});
    }
};

async function removeUserById (req,res) {
    try{
        const removeUser = await User.remove({_id: req.params.userId});
        res.json(removeUser);
    }catch (err) {
        res.json({ message : err});
    }
};

// Login method for user.
async function login (req,res) {

    let email = req.body.email;
    let password = req.body.password;
    
    
    // validate given inputs , check email and password. 
    try{
        if(!Validation.isValidEmail(email))
        {
            return res.status(400).json({errorCode:"10001",message:"Invalid email format, please try again."})
        } else if(!Validation.validatePassword(password)) {
            return res.status(400).json({errorCode:"10002",message:"Invalid Password format, please try again"});
        }else {
          const user = await User.login(email, password)
          const token = createToken(user._id);
          console.log(token);
                      let data;
                      let result = {
                          status : "success",
                          data: {
                              token : token,
                              userId : user._id
                          }
                      }
                      res.status(201).send(result);
                      res.status(200).json(result.token);        
         }

    }catch (err) {
        const errors = handleErrors(err);
        console.log(errors);
        res.status(400).json(errors);
    }
        // Check if email exists in db , 
        //    then check if email and password is matching in db 
        //              then 
        //                  generate token 
        //                  update for that user 
        //                  share the user id and token in response. 
        //              else
        //                  send response as email and password not matching with status code as 400
        //     else
        //          send response as email is not resgistered, please contact admin  status code as 400
};

// Function to Check status of the user
 async function profile(req,res){
    console.log("Hello World");
 };

module.exports = {
    registerUser : registerUser,
    getRegisteredUser : getRegisteredUser,
    getUserById : getUserById,
    updateUserById : updateUserById,
    removeUserById : removeUserById,
    login : login,
    profile : profile
}