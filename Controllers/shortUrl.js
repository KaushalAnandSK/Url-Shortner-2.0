const ShortUrl =require('../models/ShortUrl');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const bcrypt = require('bcrypt');
const { getIpAddress } = require('../Helpers/validate');
const { uniqueTrack } = require('../Helpers/validate');

//creating short URLs.
async function createUrls (req,res){
    let { longUrl, password, Action } = req.body;

    //Adding base url
    const baseUrl = config.get('baseURL');
    //clicks
    let clicks;
    
    let Password;

    //Importing USERID from users
    const UserID = req.user.payload.userId;
    
    //Array containing url-details.
    let url_tracker = {
        ip_address : "",
        user_agent : ""
    };
    
    //Getting ip address
    var urlIp = getIpAddress(req, uniqueTrack);
    
    //Getting User Agent. 
    var urlUserAgent = req.get('user-agent');
    
    //Check base url.
    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base url');
    }

    //Create url code.
    const urlCode = shortid.generate();

    //Getting complete shoertUrl.
    shortUrl = baseUrl + '/' + urlCode;

    //check long url.
    if(validUrl.isUri(longUrl)){
        try{
            let createObj = {urlCode, longUrl, password : Password, shortUrl, clicks, url_tracker, user_id : UserID, Action};

            //Hashing Password if password exists.
            if(password == ""){
                createObj.password = "";
            }else{
                const salt = await bcrypt.genSalt(5);
                Password = await bcrypt.hash(password, salt);
                createObj.password = Password;
            }
           
            //Creating obj.
            let result = await ShortUrl.create(createObj);
            console.log("Result  -- > ", result);
                 result = {
                    status : "success",
                    data: {
                            // longUrl : longUrl,
                            // shortUrl : shortUrl,
                            // urlCode : urlCode,
                            // clicks,
                            // url_tracker: url_tracker,
                            // user_id : UserID,
                            // password : Password,
                            // Action : Action,
                            // timestamp :  result.timestamp
                            message : " short url generated "
                        }
                    }           
                res.status(200).json(result);               
        } catch (err){
            console.error(err);
            res.status(500).json('Long url is already present');
        }
    } else {
        res.status(400).json('Invalid long url');
    }  
}

async function redirectToUrl (req, res) {
    let { password } = req.body;
    const url = await ShortUrl.findOne({ urlCode : req.params.code });
    var clickCount;

    //Getting ip address
    var urlIp = getIpAddress(req, uniqueTrack);
        
    //Getting User Agent. 
    var urlUserAgent = req.get('user-agent');

    if(url){
        if (password == "") {
            if(clickCount >= config.allowedClick){
                console.log("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
                return res.status(400).json("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
            }

             //Array containing url-details.
            let url_tracker = {
                ip_address : urlIp,
                user_agent : urlUserAgent,
                timestamp : url.timestamp
            };

            clickCount++;
            await url.updateOne({ url_tracker,  clickCount});
            console.log(url_tracker);

            return res.redirect(url.longUrl);
        } else {
            const auth = await bcrypt.compare(password, url.password);
            if(auth){
                if(clickCount >= config.allowedClick){
                    console.log("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
                    return res.status(400).json("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
                }
                 //Array containing url-details.
                 let url_tracker = {
                    ip_address : urlIp,
                    user_agent : urlUserAgent
                };
    
                clickCount++;
                await url.update({ url_tracker,  clickCount});
                console.log(url_tracker);
    
                res.redirect(url.longUrl);
            }else{
                console.status(400).json({ message : "Password do not matched... "});
            }
        }    
      }else{
        res.status(400).json({ message : "Url don't match with record"});
    }  
}

async function getUrl (req, res) {
    const url = await ShortUrl.findOne( {urlCode : req.params.code});
    if(url){
        return res.status(200).json({ url });
    } else {
        return res.status(404).json('No url found');
    }
}

async function getAllRoute (req, res) {
    try {
        res.json(res.paginationResults);
    } catch (err) {
       res.json({message : err}) 
    }
};    

async function updateUrl (req,res){
    var url =req.body;
    console.log("req.body  --- >",req.body);

    try{
        const updateUrl = await ShortUrl.updateOne(
            {_id : req.params.urlId},
            { $set: url }
        );
        res.json(updateUrl);
    }catch (err) {
        res.json({ message : err});
    }
};

async function removeUrl (req,res){
    try{
        const removeUrl = await ShortUrl.remove({_id : req.params.urlId});
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
    updateUrl : updateUrl,
    removeUrl : removeUrl
}