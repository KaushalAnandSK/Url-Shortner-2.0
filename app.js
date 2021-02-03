//CREATING Reference
const express=require('express');
const bodyParser=require('body-parser');
const connectDB = require('./config/db');
const cookieSession=require('cookie-session');
const key =require('./config/keys');
const passport=require('passport');

//INSTANCE of express
const app=express();

//REFERENCE for .env
require('dotenv/config');

//IMPORT Parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use( bodyParser.json());

//DB Connection.
connectDB();

//Set cookie session.
app.use(cookieSession ({
  maxAge : 24*60*60*1000,
  keys : [key.session.cookieKey]
}));

//Initalize password.
app.use(passport.initialize());
app.use(passport.session());

//IMPORTS ROUTES
const userRoute=require('./routes/user');
app.use('/user',userRoute);

const shortUrlRoute=require('./routes/shortUrl');
app.use('/shortUrl',shortUrlRoute);

const urlTrackerRoute=require('./routes/UrlTracker');
app.use('/urlTracker',urlTrackerRoute);

const useractivitiesRoute=require('./routes/userActivities');
const { config } = require('dotenv/lib/main');
const keys = require('./config/keys');
app.use('/useractivities',useractivitiesRoute);

//ROUTES
app.get('/', (req,res) => {
  res.send("Hello World");
});

//How we start listening the server(port).
app.listen(5000, () => {console.log("Listening on port 5000...")});