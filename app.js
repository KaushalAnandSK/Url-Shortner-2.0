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

//Initalize password.
app.use(passport.initialize());
app.use(passport.session());

//IMPORTS ROUTES
const userRoute=require('./routes/user');
app.use('/user',userRoute);

const shortUrlRoute=require('./routes/shortUrl');
app.use('/shortUrl',shortUrlRoute);

//ROUTES
app.get('/', (req,res) => {
  res.send("Hello World");
});

//How we start listening the server(port).
app.listen(5000, () => {console.log("Listening on port 5000...")});