const ShortUrl =require('../models/ShortUrl');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
 
async function getRoute (req,res){
    // let page=req.query.page;
    // let limit =req.query.limit;
    try{
        const url = await ShortUrl.findOne({ urlCode: req.params.code });
        console.log(url);

        if(url){
            var clickCount = url.clicks;
            if(clickCount >= config.allowedClick){
                console.log("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
                return res.status(400).json("The click count for shortcode " + shortUrlCode + " has passed the limit of " + config.allowedClick);
            }
            clickCount++;
            await url.update({ clickCount });
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('No url found');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
};

async function postRoute (req,res){
    const { longUrl } = req.body;
    const baseUrl = config.get('baseURL');

    //Chech base url.
    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base url');
    }

    //Create url code.
    const urlCode = shortid.generate();

    //check long url.
    if(validUrl.isUri(longUrl)){
        try{
            let url = await ShortUrl.findOne({ longUrl });

            if(url){
                res.json(url);
            }else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new ShortUrl({
                    longUrl,
                    shortUrl,
                    urlCode,
                    clicks : 0,
                });
                await url.save();

                res.json(url);
            }
        } catch (err){
            console.error(err);
            res.status(500).json('server error');
        }
    } else {
        res.status(400).json('Invalid long url');
    }


};
async function getUniqueRoute (req,res){
    try{
        const uniqueUrl = await shortUrl.findById(req.params.UrlId);
        res.json(uniqueUrl);
    }catch (err) {
        res.json({ messagec: err});
    }
};

async function removeRoute (req,res){
    try{
        const removeUrl = await ShortUrl.remove({_id: req.params.userId});
        res.json(removeUrl);
    }catch (err) {
        res.json({ message : err});
    }
};

module.exports = {
    getRoute : getRoute,
    postRoute : postRoute,
    getUniqueRoute : getUniqueRoute,
    removeRoute : removeRoute
}