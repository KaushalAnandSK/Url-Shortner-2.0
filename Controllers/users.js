const {roles} = require('../Helpers/roles');
const User=require('../models/User');
const Validation=require('../Helpers/validate');
const jwt = require('jsonwebtoken');
const passportSetUp = require('../config/passport-setup');
const bcrypt = require('bcrypt');

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
        return errors;
    }

    //duplicate error code
    if(err.code ===11000){
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

//Creating Token.
const createToken = (user) => {
    const maxToken = 3*24*60*60;
    console.log("UserTest -- > ",user);
    let userObj = {
        "userId":user["_id"],
        "user":user
    }
    console.log("userObj --- > ",userObj);
  return jwt.sign(userObj, secretKey , {expiresIn: maxToken});
}

//Verify token. 
async function verifyToken (req, res, next) {
    const bearerHeader = req.headers.authorization;
    let bearerToken;
    if(typeof bearerHeader != 'undefined'){
        const bearer =bearerHeader.split(' ');
        bearerToken =bearer[1];      
        jwt.verify(bearerToken, secretKey, (err, authData) => {
            if(err){
                res.status(403).json({message : "You need to be logged in to access this route"});
            }else
                req.user = jwt.decode(bearerToken, {complete: true});
                next();
        });
    }else{
        res.status(403).json({message : 'Forbidden'});
    };
};

//Validating Roles.
let grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
      console.log("req.user -- >",req.user.payload);
   const permission = roles.can(req.user.payload.user.role)[action](resource);
   console.log("permission  -- >", permission);
   
   if (!permission.granted) {
       console.log("resource -- > ", resource);
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}

//Function to register an given user details 

async function registerUser (req,res) {
    const {fName,lName, email, password, role} =req.body;
    
    try{
        const userObj = {fName, lName, email, password, role : role || 'User'};
        const user = await User.create(userObj);
                    console.log(user);
                    let result = {
                        status : "success",
                        data: {
                            user : user
                        }
                    }
        res.status(200).json(result);
    }catch (err){
        const errors = handleErrors(err);
        await res.status(400).json({ errors });
    }
};

async function getRegisteredUser (req,res) {
    try{
         res.json(res.paginationResults);
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
        console.log(err);
        res.json({ message : err});
    }
};

// Login method for user.
async function login (req,res) {
    console.log("Valid login -- >",login);
    let {fName, lName, email, password, role} = req.body;
    console.log("req.body -- >",req.body);
    // validate given inputs , check email and password. 
    try{
        if(!Validation.isValidEmail(email))
        {
            console.log("Valid Email -- >",email);
            return res.status(400).json({errorCode:"10001",message:"Invalid email format, please try again."})
        } else if(!Validation.validatePassword(password)) {
            console.log("Valid password -- >",password);
            return res.status(400).json({errorCode:"10002",message:"Invalid Password format, please try again"});
        }else {
          const user = await User.findOne({email: email});
          console.log("User --- >",user)
            if(user){
                console.log("Bcrypt password -- >",user.password);
                console.log("user password -- >",password);
                const auth = await bcrypt.compare(password, user.password);
                console.log("Auth  -- >",auth);
                if(auth) {
                    const token = createToken(user);
                    const result = {
                        status : "success",
                        data: {
                            token : token,
                            userId : user._id
                        } 
                    }
                    res.status(200).json(result);
                }else {
                    res.status(400).json({ message : "Password incorrect"});
                }
            }
            res.status(400).json({ message : "Email incorrect"});
        }
    }catch (err) {
        const errors = handleErrors(err);
        console.log(errors);
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

module.exports = {
    registerUser : registerUser,
    getRegisteredUser : getRegisteredUser,
    getUserById : getUserById,
    updateUserById : updateUserById,
    removeUserById : removeUserById,
    login : login,
    grantAccess : grantAccess,
    verifyToken : verifyToken,
    createToken : createToken
}