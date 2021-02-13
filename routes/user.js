const express=require('express');
const router =express.Router();
const UserController = require("../Controllers/users");
const passport =require('passport');
const { route } = require('./shortUrl');
const { google } = require('../config/keys');
const User= require('../models/User');
const paginationResults = require('../Helpers/pagination');
const { verifyAccessTokenForUserId } =require('../Helpers/validate');

//Login user
router.post('/login', UserController.login);

//auth with google
router.get('/google', passport.authenticate('google',{
    scope : ['profile']
}));

//callback route for google to redirect.
router.get('/google/redirect', passport.authenticate('google') , (req,res) => {
    res.send('you reached the callback URL');
});

//Submiting a user.
router.post('/register', UserController.registerUser);

//Getting all registered user.
router.get('/register/list', verifyAccessTokenForUserId, UserController.verifyToken, UserController.grantAccess('readAny', 'profile'), paginationResults(User), UserController.getRegisteredUser);

//Getting specific user.
router.get('/:userId', verifyAccessTokenForUserId, UserController.getUserById);

//updating user.
router.put('/update/:userId', verifyAccessTokenForUserId, UserController.verifyToken, UserController.grantAccess('updateAny', 'profile'), UserController.updateUserById);

//deleting specific post.
router.delete('/remove/:userId', verifyAccessTokenForUserId, UserController.verifyToken, UserController.grantAccess('deleteAny', 'profile'), UserController.removeUserById);

module.exports =router;