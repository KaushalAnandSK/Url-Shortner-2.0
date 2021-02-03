const mongoose=require('mongoose');

const oAuthSchema = new mongoose.Schema({
    username : {
        type : String
    },           
    googleId: {
        type : String
    }    
});

module.exports = mongoose.model('oAuth',oAuthSchema);