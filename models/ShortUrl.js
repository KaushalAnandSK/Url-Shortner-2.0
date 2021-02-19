const mongoose=require('mongoose');

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
        type : Number,
        default : 0
        },

    user_id: { 
            type : String
    },

    token : {
        type : String
    },
    
}, {timestamps : true});

shortUrlSchema.path('longUrl').validate(async (longUrl) => {
    const urlCodeCount = await mongoose.models.ShortUrl.countDocuments({ longUrl })
        return !urlCodeCount 
}, 'This long url already exists');

module.exports = mongoose.model('ShortUrl',shortUrlSchema);

