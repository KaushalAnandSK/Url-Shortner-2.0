const express=require('express');
const router =express.Router();
const userActivityController =require('../Controllers/userActivities');
const { verifyAccessTokenForUrlId } =require('../Helpers/validate');

//Get all the activities.
router.get('/', verifyAccessTokenForUrlId, userActivityController.getActivity);

//Get unique activity.
router.get('/:activityId', verifyAccessTokenForUrlId, userActivityController.getUniqueActivity);


module.exports =router;