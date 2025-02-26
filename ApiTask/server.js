var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, 'local.env')})

// db connection
const connectDB = require('./config/db');
connectDB();

// import routes
app.use('/api', require('./routes'));

const Port = process.env.port || 3040;
var server = app.listen(Port, function () {
    console.log("API listening at: ", Port);
});
