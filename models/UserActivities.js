const mongoose=require('mongoose');

const  user_activitiesSchema=new mongoose.Schema({
    UserID: { 
        type : String
    },    
    Action: {
        type : String
    },
    TimeStamp: {
        type : String,
    }
});

module.exports = mongoose.model('Activity',user_activitiesSchema);