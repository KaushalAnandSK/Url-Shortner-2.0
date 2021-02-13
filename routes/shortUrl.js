const express=require('express');
const router =express.Router();
const shortUrlController=require('../Controllers/shorturl');
const paginationResults = require('../Helpers/pagination');
const ShortUrl =require('../models/ShortUrl');
const { verifyAccessTokenForUserId } =require('../Helpers/validate')

//Submit the url detail without password.
router.post('/url',verifyAccessTokenForUserId, shortUrlController.createUrls);

//Redirect to url.
router.get('/redirect-url/:code', verifyAccessTokenForUserId, shortUrlController.redirectToUrl);

//Get secure url data
router.get('/get-url/:code', verifyAccessTokenForUserId, shortUrlController.getUrl);

//Get all the routes.
router.get('/all-url', verifyAccessTokenForUserId, paginationResults(ShortUrl), shortUrlController.getAllRoute);

//Getting specific url detail.
router.patch('/modify/:urlId', verifyAccessTokenForUserId, shortUrlController.updateUrl);

//Remove Url.
router.delete('/remove-url/:urlId', verifyAccessTokenForUserId, shortUrlController.removeUrl);

module.exports =router;