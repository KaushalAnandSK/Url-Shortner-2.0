const mongoose=require('mongoose');

const logSchema = new mongoose.Schema({
    UserID : { type : String },

    user_activities : [
        {
            Action : { type : String },
            timestamp: { type: Date, default: Date.now},
           
        }
    ]
});

module.exports =mongoose.model('Log', logSchema);