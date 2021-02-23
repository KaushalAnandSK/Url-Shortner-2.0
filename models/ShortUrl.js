const mongoose=require('mongoose');

//Short Url Schema.
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

        totalClick: {
            type : Number,
            default : 0
        }

    }],

    user_id: { 
            type : String
    },

    token : {
        type : String
    },

    date : { 
        type : String
    },

    time : {
        type :String
    }
    
} , { timestamps : true });

//Checking wheather Url exists!!
shortUrlSchema.path('longUrl').validate(async (longUrl) => {
    const urlCodeCount = await mongoose.models.ShortUrl.countDocuments({ longUrl })
        return !urlCodeCount 
}, 'This long url already exists');

module.exports = mongoose.model('ShortUrl',shortUrlSchema);

