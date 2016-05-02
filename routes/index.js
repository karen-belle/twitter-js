'use strict';
var express = require('express');
var router = express.Router();
//var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets(io, client) {
    // a reusable function

    // function respondWithAllTweets(req, res, next) {
    //     client.query('SELECT * FROM tweets', function(err, data) {
    //         if (err) {
    //             console.error(err);
    //         }
    //         var tweets = data.rows;
    //         res.render('index', { title: 'Twitter.js', tweets: tweets });
    //         // });

    //     });
    // }

    // here we basically treet the root view and tweets view as identical
    router.get('/', function(req, res, next) {

        client.query('SELECT * FROM tweets INNER JOIN users ON tweets.userid = users.id', function(err, results) {

            var tweets = results.rows;
            console.log(tweets);
            res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });

        });
    });

    router.get('/tweets', function(req, res, next) {

        client.query('SELECT * FROM tweets INNER JOIN users ON tweets.userid = users.id', function(err, results) {

            var tweets = results.rows;
            console.log(tweets);
            res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });

        });
    });

        router.get('/tweets/:id', function(req, res, next) {
          var tweetsWithThatId = Number(req.params.id);
          console.log(tweetsWithThatId);
        client.query('SELECT * FROM tweets INNER JOIN users ON tweets.userid = users.id WHERE tweets.id=2', function(err, results) {

            var tweets = results.rows;
            console.log(tweets);
            res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });

        });
    });



    // client.query('SELECT name FROM users WHERE name=$1', ['Nimit'], function(err, data) { /** ... */ });
    // // single-tweet page
    // // router.get('/tweets/:id', function(req, res, next) {
    // //     var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    // //     res.render('index', {
    // //         title: 'Twitter.js',
    // //         tweets: tweetsWithThatId // an array of only one element ;-)
    // //     });
    // // });

    // // create a new tweet
    // // router.post('/tweets', function(req, res, next) {
    // //     var newTweet = tweetBank.add(req.body.name, req.body.text);
    // //     io.sockets.emit('new_tweet', newTweet);
    // //     res.redirect('/');
    // // });
    // client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [10, 'I love SQL!'], function(err, data) { /** ... */ });




    // // replaced this hard-coded route with general static routing in app.js
    // router.get('/stylesheets/style.css', function(req, res, next){
    //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
    // });

    return router;
}
