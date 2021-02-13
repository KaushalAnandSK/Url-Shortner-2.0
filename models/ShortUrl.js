const mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const shortUrlSchema=new mongoose.Schema({
    
    urlCode: { 
        type : String,
    },
    longUrl : {
        type : String,
        unique: true
    },

    password: {
        type: String,
    },
    
    shortUrl: { 
        type : String,
    },

    url_tracker : [{

        ip_address : {
            type : String
        },
    
        user_agent : {
            type : String
        },
        timestamp : { type: Date, default: Date.now},

    }],

    clicks: { 
        default : 0,
        type : Number
        },

    user_id: { 
            type : String
    },

    token : {
        type : String
    },

    timestamp: { type: Date, default: Date.now},

});

shortUrlSchema.plugin(uniqueValidator); 

module.exports = mongoose.model('ShortUrl',shortUrlSchema);

