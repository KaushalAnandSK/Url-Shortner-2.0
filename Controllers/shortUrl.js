const ShortUrl =require('../models/ShortUrl');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const bcrypt = require('bcrypt');
const { getIpAddress } = require('../Helpers/validate');
const { uniqueTrack } = require('../Helpers/validate');
const { findOneAndUpdate } = require('../models/ShortUrl');
const mongoose=require('mongoose');

//creating short URLs.
async function createUrls (req,res){
    let { longUrl, password, Action } = req.body;

    //Adding base url
    const baseUrl = config.get('baseURL');
    
    let Password;

    //Importing USERID from users
    const UserID = req.user.payload.userId;
    
    //Array containing url-details.
    let url_tracker = {
        ip_address : "",
        user_agent : ""
    };
    
    //Check base url.
    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base url');
    }

    //Create url code.
    let urlCode = shortid.generate();

    //Getting complete shoertUrl.
    shortUrl = baseUrl + '/' + urlCode;

    
    //Current date and time.
    var date = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();
                            

    //check long url.
    if(validUrl.isUri(longUrl)){
        try{
            let longURL = await ShortUrl.findOne({ longUrl });
            
            //  console.log(" longUrl --- >",longUrl);
            if(longURL == null && longURL != longUrl){
                let createObj = {urlCode, longUrl, password : Password, shortUrl, url_tracker, user_id : UserID, Action, date : date, time : time};

                //Hashing Password if password exists.
                if(password == "" && password == null){
                    createObj.password = "";
                }else{
                    let salt = await bcrypt.genSalt(5);
                    Password = await bcrypt.hash(password, salt);
                    createObj.password = Password;
                }

                //Creating obj.
                let result = await ShortUrl.create(createObj);

                console.log("Result  -- > ", result);
                    result = {
                        status : "success",
                        data: {
                                message : " short url generated "
                            }
                        }           
                    res.status(200).json(result);    
                    }else{
                        res.status(500).json({ message : " longUrl already exists "});  
                    }            
                } catch (error){
                        console.error(error);
                        res.status(500).json({ message : " Server error "});
                    }
            } else {
                res.status(400).json('Invalid long url');
        }  
}

//Redirect Route.
async function redirectToUrl (req, res) {
    let { password } = req.body;
    let url = await ShortUrl.findOne({ _id : req.params.urlId});

    //Getting ip address
    var urlIp = getIpAddress(req, uniqueTrack);
        
    //Getting User Agent. 
    var urlUserAgent = req.get('user-agent');

    if(url){
        try {
            if (password == "") {
                    //Getting _id from db.
                    let objId =mongoose.Types.ObjectId(req.params.urlId);

                    //Getting _id from array inside the db.
                    let objId2 = await ShortUrl.find({"_id" : objId});
                    objId2 = objId2[0].url_tracker[0]._id;
                    console.log("objId2 --- > ",objId2);

                    //Updating the totalclick,ip,user_agent.
                    await ShortUrl.findOneAndUpdate({_id : objId, "url_tracker._id" : objId2}, 
                                                    { $inc : { "url_tracker.$.totalClick" : 1}, 
                                                    "url_tracker.$.ip_address" : urlIp, 
                                                    "url_tracker.$.user_agent" : urlUserAgent
                                        });
                    
                    //Redirect to longUrl.
                    res.redirect(url.longUrl);
            } else {
                    const auth = await bcrypt.compare(password, url.password);
                    if(auth){
                        //Getting _id from db
                        let objId =mongoose.Types.ObjectId(req.params.urlId);
                        
                        //Getting _id from array inside the db
                        let objId2 = await ShortUrl.find({"_id" : objId});
                        objId2 = objId2[0].url_tracker[0]._id;
                        
                        //Updating the totalclick,ip,user_agent
                        await ShortUrl.findOneAndUpdate({_id : objId, "url_tracker._id" : objId2},{ $inc : { "url_tracker.$.totalClick" : 1}, "url_tracker.$.ip_address" : urlIp, "url_tracker.$.user_agent" : urlUserAgent});
                        
                        //Redirect to longUrl.
                        res.redirect(url.longUrl);
                    }else{
                        console.status(400).json({ message : "Password do not matched... "});
                    }
                }    
        
            }catch (error) {
                console.log("error",error);
            res.status(400).json( { message : "Cannot update database"});
        }      
      }else{
        res.status(400).json({ message : "Url don't match with record"});
    }  
}

//Find Url details by _id.
async function getUrl (req, res) {
    try {
        let url = await ShortUrl.findOne({_id : req.params.urlId});
        res.status(200).json(url)
    } catch (error) {
        console.log(error);
        res.status(error).json('No url found');
    }
}

//Find all Url details.
async function getAllRoute (req, res) {
    try {
        res.json(res.paginationResults);
    } catch (err) {
       res.json({message : err}) 
    }
};    

//Remove Url by _id
async function removeUrl (req,res){
    try{
        let removeUrl = await ShortUrl.remove({_id : req.params.urlId});
        res.json(removeUrl);
    }catch (err) {
        res.json({ message : err});
    }
};

module.exports = {
    createUrls : createUrls,
    redirectToUrl : redirectToUrl,
    getUrl : getUrl,
    getAllRoute : getAllRoute,
    removeUrl : removeUrl
}