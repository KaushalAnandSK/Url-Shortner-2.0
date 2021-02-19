const {roles} = require('../Helpers/roles');
const User=require('../models/User');
const Validation=require('../Helpers/validate');
const jwt = require('jsonwebtoken');
const passportSetUp = require('../config/passport-setup');
const bcrypt = require('bcrypt');
const Log =require('../models/log');
const shoertUrl =require('../models/ShortUrl');
const ShortUrl = require('../models/ShortUrl');

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
    let userObj = {
        "userId":user["_id"],
        "user":user
    }
  return jwt.sign(userObj, secretKey , {expiresIn: maxToken});
}

//Validating Roles.
let grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
      console.log("req.user -- >",req.user.payload);
   const permission = roles.can(req.user.payload.user.role)[action](resource);
   
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
    let total_clicks;
    
    try{
        let userObj = {fName, lName, email, password, total_clicks : total_clicks, role : role || 'User'};
        let user = await User.create(userObj);
        console.log(user);
                    console.log(user);
                    let result = {
                        status : "success",
                        data: {
                            message : "Registration is sucessfull"
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
        console.log("uni", req.params.userId);
        console.log("unique  -- > ",uniqueUser);
        res.json(uniqueUser);

    }catch (err) {
        res.json({ message : err});
    }
};

async function updateUserById (req,res) {
    var user = req.body;
       try{
        const updateUser= await User.updateOne(
            {_id : req.params.userId},
            {$set : user}
        );
        console.log("Update --- > ", updateUser);
        res.json(updateUser);
    }catch (err) {
        res.json({ message : err });
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

async function logout (req,res) {
    let action = "Logout";
    const UserID = req.user.payload.userId;
    try {
        let logs = await Log.create( {user_activities: [{Action: action}], UserID: UserID} );
        console.log("logs --- > ",logs);
        res.status(200).json(logs)
    } catch (error) {
        res.status(400).json({ message : "Logout failed.."});
    }
 
}

async function logDetails (req,res) {
    try {
        let logDetails = await Log.findById();
        res.status(200).json(logDetails);
    } catch (error) {
        res.status(400).json({ message : "The given log details are not available."});
    }
}

async function logAllDetails (req,res) {
    try {
        res.json(res.paginationResults);
    } catch (error) {
        res.status(400).json({ message : "request cannot be completed"});
    }
}

// Login method for user.
async function login (req,res) {
    let { email, password } = req.body;
    var action = "Login";
    
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
          let user = await User.findOne({email: email});
          let user_ID = user && user._id;
          
         let logs = await Log.create({ user_activities: [{Action: action}], UserID: user_ID});
            if(user){
                const auth = await bcrypt.compare(password, user.password);
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

//Adding Dashboard

async function dashboad (req,res) {
 try {
     let obj = {};
     let totalUserRegistered = await User.count();
     let totalUserRegisteredIn24Hr = await User.count( {"createdAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}} );
     let totalUrlRegistered = await ShortUrl.count();
     let totalUrlRegisteredIn24Hr = await ShortUrl.count( {"createdAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}} );
     let recent10UrlGenerated = await ShortUrl.find().sort({created_at: -1}).limit(10);
     let recent10UserACtivities = await Log.find().sort({created_at: -1}).limit(10);
     obj['totalUserRegistered'] = totalUserRegistered;
     obj['totalUserRegisteredIn24Hr'] = totalUserRegisteredIn24Hr;
     obj['totalUrlRegistered'] = totalUrlRegistered;
     obj['totalUrlRegisteredIn24Hr'] = totalUrlRegisteredIn24Hr;
     obj['recent10UrlGenerated'] = recent10UrlGenerated;
     obj['recent10UserACtivities'] = recent10UserACtivities;

     res.status(200).json(obj);
 } catch (error) {
     res.status(400).json({ message : "The required log details in not available"});
 }
}

//Adding update password

async function updatePassword (req, res){

}

module.exports = {
    registerUser : registerUser,
    getRegisteredUser : getRegisteredUser,
    getUserById : getUserById,
    updateUserById : updateUserById,
    removeUserById : removeUserById,
    login : login,
    grantAccess : grantAccess,
    createToken : createToken,
    logout : logout,
    logDetails : logDetails,
    logAllDetails : logAllDetails,
    dashboad : dashboad,
    updatePassword : updatePassword
}