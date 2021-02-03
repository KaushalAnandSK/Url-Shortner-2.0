const express=require('express');
const router =express.Router();
const urlTrackerController=require('../Controllers/urlTracker');

//Get back all the  tracked records.
router.get('/', urlTrackerController.getRoute);

//get unique track record.
router.get('/:urlId', urlTrackerController.getUniqueRoute);

module.exports =router;