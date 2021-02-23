const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail }=require('validator');

//Schema for User.
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

//Adding hashing and salting in middleware(for password).
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(5);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('user',userSchema);