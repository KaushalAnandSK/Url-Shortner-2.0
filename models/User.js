const mongoose=require('mongoose');
const bcrypt = require('bcrypt');

const userSchema=new mongoose.Schema({
    fName: {  
             type: String, 
           },
    lName: {
             type : String, 
           },  
    email: {
             type : String,
           },
    password: {
             type : String,
              },            
    Token: 
         {
         type: String
    }
 });

//Function before saved to db and adding hashing and salting to it(for password).
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}

module.exports = mongoose.model('user',userSchema);