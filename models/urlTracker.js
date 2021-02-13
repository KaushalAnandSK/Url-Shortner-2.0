const mongoose=require('mongoose');

const  shortUrl_trackerSchema=new mongoose.Schema({
    UserID: { 
        type : String
    },

    shortUrl: {
        type : String
    },

    clicks: {
        type : Number
    },
    
    IP_Address : {
        type : String
    },

    User_Agent: {
        type : String
    }
});

module.exports = mongoose.model('Tracker',shortUrl_trackerSchema);