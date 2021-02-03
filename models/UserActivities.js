const mongoose=require('mongoose');

const  user_activitiesSchema=new mongoose.Schema({
    Date: {
        type : Date,
        default : new Date().getTime()
    },
    Action: {
        type : String,
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Activity',user_activitiesSchema);