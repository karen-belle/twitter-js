'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var makesRouter = require('./routes');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');
var socketio = require('socket.io');

var pg = require('pg');
var conString = 'postgres://localhost:5432/twitterdb';
var client = new pg.Client(conString);


// connect to postgres
client.connect();

// Pass the client down to the routes
// app.use('/', routes(io, client));

// client.query('SELECT * FROM tweets', function (err, result) {
//   var tweets = result.rows;
//   res.render('index', { title: 'Twitter.js', tweets: tweets });
// });


swig.renderFile(__dirname + '/views/index.html', {
    tweets: [
        { name: 'Joe', text: 'Hello!' }
    ]
}, function(err, output) {
    //console.log(output);
});


// templating boilerplate setup
app.set('views', path.join(__dirname, '/views')); // where to find the views
app.set('view engine', 'html'); // what file extension do our templates have
app.engine('html', swig.renderFile); // how to render html templates
swig.setDefaults({ cache: false });

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

// start the server
var server = app.listen(3000, function() {
    console.log('listening on port 3000');
});
var io = socketio.listen(server);

// modular routing that uses io inside it

// the typical way to use express static middleware.
var publicDir = path.join(__dirname, '/public')
var staticMiddleware = express.static(publicDir);
app.use(staticMiddleware);
app.use('/', makesRouter(io, client));

// // manually-written static file middleware
// app.use(function(req, res, next){
//   var mimeType = mime.lookup(req.path);
//   fs.readFile('./public' + req.path, function(err, fileBuffer){
//     if (err) return next();
//     res.header('Content-Type', mimeType);
//     res.send(fileBuffer);
//   });
// });
