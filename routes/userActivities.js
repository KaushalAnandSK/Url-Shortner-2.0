const express=require('express');
const router =express.Router();
const userActivityController =require('../Controllers/userActivities');

//Get all the activities.
router.get('/', userActivityController.getActivity);

//Get unique activity.
router.get('/:activityId', userActivityController.getUniqueActivities);

//post activities.
router.post('/post', userActivityController.postActivities);

module.exports =router;