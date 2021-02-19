const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const { UserAgent } = require('express-useragent');
const { isEmail }=require('validator');

const userSchema=new mongoose.Schema({
    fName: {  
             type : String, 
    },

    lName: {
             type : String, 
    },  
    email: {
             type : String,
             unique : true,
             required : [true, "Please enter an email"],
             validate : [isEmail, 'Please enter a valid email']
    },
    password: {
             type : String,
             required : [true, 'Please enter an password'],
             minlength : [6, 'Minimum password length is 6 character']
    },
    role: {
             type : String,
             default: 'User',
             enum: ["User", "Admin"]
    },                               
    token: 
         {
         type : String,
         unique : true,
         sparse : true 
    },
 },{timestamps : true}
 );

//Function before saved to db and adding hashing and salting to it(for password).
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(5);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('user',userSchema);