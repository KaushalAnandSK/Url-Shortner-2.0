const mongoose=require('mongoose');

//Schema for log.
const logSchema = new mongoose.Schema({
    UserID : { type : String },

    user_activities : [
        {
            Action : { type : String },

            date : { 
                type : String
            },
        
            time : {
                type :String
            }
        }
    ]
});

module.exports =mongoose.model('Log', logSchema);