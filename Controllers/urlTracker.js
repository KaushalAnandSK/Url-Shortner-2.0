const Tracker=require('../models/urlTracker');

async function getTracker (req,res){
    const UserID = req.url.payload.url.UserID;
    const shortUrl = req.url.payload.url.shortUrl;
    const clicks = req.url.payload.url.clicks;
    const IP_Address = req.url.payload.url.IP_Address;
    const User_Agent = req.url.payload.url.User_Agent;
    console.log("UserID   --- > ",UserID)

    try{
        let createOBj = {UserID, shortUrl, clicks, IP_Address, User_Agent};
        const track = await Tracker.create(createOBj);

        if(track){
            res.json(track)
        }else{
            tracking = new track({
                UserID ,
                shortUrl,
                clicks,
                IP_Address, 
                User_Agent
            });

            console.log("tracking --- >",tracking);
            res.json(tracking);
        }
    }catch (err) {
        res.json({ message : err});
    }
    
};  

async function getUniqueTrack (req,res) {

    const UserID = req.url.payload.userId;
    const shortUrl = req.url.payload.shortUrl;
    const clicks = req.url.payload.clicks;
    const IP_Address = req.url.payload.IP_Address;
    const User_Agent = req.url.payload.User_Agent;

    try{
        const track = await Tracker.findById(req.params.trackingId);

        tracking = new track({
            UserID,
            shortUrl,
            clicks,
            IP_Address, 
            User_Agent
        });

        console.log(tracking);
        res.json(tracking);
    }catch (err) {
        res.json( {message : err});
    }
}

module.exports={
    getTracker : getTracker,
    getUniqueTrack : getUniqueTrack
}    

