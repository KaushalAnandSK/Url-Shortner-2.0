const jwt = require('jsonwebtoken');

require('dotenv').config();

//Secret key.
var secretKey = process.env.SECRET_KET;


//Validate the given email.
function isValidEmail(str) {
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let res = str.match(pattern);
    if (res)
        return true;
}


//Validate the password format min 6 chars, one Uppercase 
function validatePassword(str) {
    const pattern = /^(?=[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*[A-Z])[A-Za-z0-9]{6,30}$/;

    let res = str.match(pattern);
    if (res)
        return true;
}

//Passing middleware to pass fields from user.
async function verifyAccessTokenForUserId(req, res, next) {
    var jwt_token;
    var authorization_list = req.headers.authorization.split(' ');

    if (authorization_list.length >= 2) {
        jwt_token = authorization_list[1];
    } else {
        jwt_token = authorization_list[0];
    }

    try {
        decoded = jwt.verify(jwt_token, secretKey);
    } catch (err) {
        return res.status(401).send('unauthorized');
    }
    req.user = jwt.decode(jwt_token, { complete: true });
    next();
}

//Get ip Address
function getIpAddress(req, uniqueTrack) {
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

module.exports = {
    isValidEmail: isValidEmail,
    validatePassword: validatePassword,
    verifyAccessTokenForUserId: verifyAccessTokenForUserId,
    getIpAddress: getIpAddress
}


