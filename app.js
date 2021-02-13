//CREATING Reference
const express=require('express');
const bodyParser=require('body-parser');
const connectDB = require('./config/db');
const cookieSession=require('cookie-session');
const key =require('./config/keys');
const passport=require('passport');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors =require("cors");


//INSTANCE of express
const app=express();

//REFERENCE for .env
require('dotenv/config');

app.use(cors());

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

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
   const accessToken = req.headers["x-access-token"];
   const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
   // Check if token has expired
   if (exp < Date.now().valueOf() / 1000) {
    return res.status(401).json({
     error: "JWT token has expired, please login to obtain a new one"
    });
   }
   res.locals.loggedInUser = await User.findById(userId);
   next();
  } else {
   next();
  }
});

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