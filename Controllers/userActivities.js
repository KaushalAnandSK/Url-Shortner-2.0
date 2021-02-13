const Activity =require('../models/UserActivities');

async function getActivity (req,res){
    const UserID = req.url.payload.url.userId;
    const Action = req.url.payload.url.Action;
    const TimeStamp = req.url.payload.url.createdOn;

    try{
        let createObj ={UserID, Action, TimeStamp};
        let activity = await Activity.create(createObj);

        if(activity){
            res.json(activity);
        }else{
            activities = new Activity({
                UserID,
                Action,
                TimeStamp
            });
            console.log(activities);
            res.json(activities);
        }   
    }catch (err) {
        res.json({ message : err});
    }
};  

async function getUniqueActivity (req,res) {
    const UserID = req.url.payload.url.userId;
    const Action = req.url.payload.url.Action;
    const TimeStamp = req.url.payload.url.createdOn;

    try{
        let createObj ={UserID, Action, TimeStamp};
        let activity = await Activity.findById(req.params.activityId);

        if(activity){
            res.json(activity);
        }else{
            activities = new Activity({
                UserID,
                Action,
                TimeStamp
            });
            console.log(activities);
            res.json(activities);
        }   
    }catch (err) {
        res.json({ message : err});
    }
}

module.exports = {
    getActivity : getActivity,
    getUniqueActivity : getUniqueActivity
}

//findById(req.params.activityId);