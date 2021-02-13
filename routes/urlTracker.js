const express=require('express');
const router =express.Router();
const urlTrackerController=require('../Controllers/urlTracker');
const { verifyAccessTokenForUrlId } =require('../Helpers/validate');

//Get back all the  tracked records.
router.get('/', verifyAccessTokenForUrlId, urlTrackerController.getTracker);

//get unique track record.
router.get('/:urlId', verifyAccessTokenForUrlId, urlTrackerController.getUniqueTrack);

module.exports =router;