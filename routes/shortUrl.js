const express=require('express');
const router =express.Router();
const shortUrlController=require('../Controllers/shorturl')

//Submit the url detail.
router.post('/post', shortUrlController.postRoute);

//Get back the url details.
router.get('/:code', shortUrlController.getRoute);

//Getting specific url detail.
router.get('/unique/:urlId', shortUrlController.getUniqueRoute);

//Remove Url.
router.delete('/remove', shortUrlController.removeRoute);

module.exports =router;