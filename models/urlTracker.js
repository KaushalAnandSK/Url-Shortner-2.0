const mongoose=require('mongoose');

const  shortUrl_trackerSchema=new mongoose.Schema({
    userId:{
        type : Number
    },
    Clicks: {
        type : Number
    },
    IP_Address: {
        type : String
    },
    User_Agent: {
        type : String
    }
});

module.exports = mongoose.model('Tracker',shortUrl_trackerSchema);