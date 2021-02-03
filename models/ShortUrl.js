const mongoose=require('mongoose');
const shortId =require('shortid');

const shortUrlSchema=new mongoose.Schema({
    
    urlCode: { 
        type : String,
    },
    longUrl : {
        type : String,
    },
    
    shortUrl: { 
        type : String,
    },
    clicks: { 
        type : Number,
        },
    createdOn: {
        type : Date,
        default : new Date().getTime()
    }
});

module.exports = mongoose.model('ShortUrl',shortUrlSchema);

