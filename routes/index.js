'use strict';
var express = require('express');
var router = express.Router();
//var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets(io, client) {

    router.get('/', function(req, res, next) {

        client.query('SELECT tweets.content, tweets.id, tweets.userid, users.name, users.pictureurl FROM tweets INNER JOIN users ON tweets.userid = users.id', function(err, results) {
            var tweets = results.rows;
            res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });

        });
    });

    router.get('/tweets', function(req, res, next) {

        client.query('SELECT tweets.content, tweets.id, tweets.userid, users.name, users.pictureurl  FROM tweets INNER JOIN users ON tweets.userid = users.id', function(err, results) {
            var tweets = results.rows;
            //console.log(tweets);
//            var contentArray = tweets.content.split("#"+tweets.hashtag);
            //console.log(contentArray);
            res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });

        });
    });

    router.get('/users/:username', function(req, res, next) {
        client.query('SELECT * FROM tweets INNER JOIN users ON tweets.userid = users.id WHERE users.name = $1', [req.params.username], function(err, results) {
            var tweets = results.rows;
            res.render('index', {
                title: 'Twitter.js',
                tweets: tweets,
                showForm: true,
                username: req.params.username

            });
        });
    });

    router.get('/tweets/:id', function(req, res, next) {
        client.query('SELECT tweets.content, tweets.id, tweets.userid, users.name, users.pictureurl FROM tweets INNER JOIN users ON tweets.userid = users.id WHERE tweets.id= $1', [req.params.id], function(err, results) {
            console.log(results.rows);
            var tweets = results.rows;

            res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });

        });
    });


    function findOrCreate(name) {
        return new Promise(function(resolve, reject) {
            client.query('SELECT id FROM users WHERE name = $1', [name], function(err, results1) {
                if (results1.rows.length === 0) {

                    console.log("But I'm here and name is ", name);
                    client.query('INSERT INTO users (name, pictureurl) VALUES ($1, $2) RETURNING id', [name, "https://upload.wikimedia.org/wikipedia/en/8/82/Beyonc%C3%A9_.jpg"], function(err, results2) {

                        resolve(results2.rows[0].id);
                        if (err) console.error(err);

                    });

                }
                else {
                    if (err) reject(err);
                    else resolve(results1.rows[0].id);
                }

            });
        });
    }

    router.post('/tweets', function(req, res, next) {
        findOrCreate(req.body.name)
            .then(function(userid) {

                var hashtag = req.body.text.match(/#(\w+)/i)[1] || null;
                console.log("#", hashtag);

                client.query('INSERT INTO tweets (userId, content, hashtag) VALUES ($1, $2, $3)', [userid, req.body.text, hashtag], function(err, results2) {
                    res.redirect('/');
                });
            });
    });

    router.get('/hashtag/:tag', function(req, res, next) {
        client.query('SELECT * FROM tweets INNER JOIN users ON tweets.userid = users.id WHERE tweets.hashtag = $1', [req.params.tag], function(err, results) {
            var tweets = results.rows;
            res.render('index', {
                title: 'Twitter.js',
                tweets: tweets,
                showForm: true,
                hashtag: req.params.tag

            });
        });
    });


    return router;
}
