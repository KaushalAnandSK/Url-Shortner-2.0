const Tracker=require('../models/urlTracker');
const shortUrl =require('../models/ShortUrl');

function getIpAddress (req, uniqueTrack){
    var ipAddress;
    var forwardedIpsStr = req.headers['x-forwarded-for']; 

    if (forwardedIpsStr) {
      var forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
      // If request was not forwarded
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
 }

async function getRoute (req,res){
    const { longUrl , createdOn } = req.body;
    // let page=req.query.page;
    // let limit =req.query.limit;
    try{
        const uniqueTrack = await shortUrl.find({longUrl, createdOn});
        var urlIp = getIpAddress(req, uniqueTrack);
        var urlUserAgent = req.get('user-agent');
        var url = new shortUrl({
            longUrl

        });
        var result ={
            url,
            urlIp,
            urlUserAgent,
            createdOn,
            longUrl
        }
        res.json(result);
    }catch (err){
        console.log(err);
        res.json({ message : err});  
    } 
};

async function getUniqueRoute (req,res) {
    try{
        const uniqueTrack = await Tracker.findById(req.params.urlId);
        res.json(uniqueTrack)
    }catch (err){
        res.json({ message : err});  
    }
}

module.exports = {
    getRoute : getRoute,
    getUniqueRoute : getUniqueRoute
}