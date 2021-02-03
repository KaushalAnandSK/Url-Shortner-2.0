const Activity =require('../models/UserActivities');

async function getActivity (req,res){
    // let page=req.query.page;
    // let limit =req.query.limit;
    try{
        const activity = await Activity.find();
        console.log(activity);
        res.json(activity);
    }catch (err) {
        res.json({ message : err});
    }
};  

async function postActivities (req,res){  
    const { Action } = req.body;     
    try{
        const activity = await Activity.create( { Action } );
        console.log(activity);
        res.send(activity);
    }catch (err){
        console.log(err);
        res.json({ message : err})
    }
}

async function getUniqueActivities (req,res) {
    try{
        const activity = await Activity.findById(req.params.activityId);
        res.json(activity);
    }catch (err) {
        res.json( {message : err});
    }
}

module.exports={
    getActivity : getActivity,
    getUniqueActivities : getUniqueActivities,
    postActivities : postActivities
}    