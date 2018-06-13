"use strict";
exports.__esModule = true;
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
//var Q = require('q');
var SongModel_1 = require("./model/SongModel");
var UserModel_1 = require("./model/UserModel");
var ReviewModel_1 = require("./model/ReviewModel");
var fs = require('fs');
var mongoose = require('mongoose');
//import necessary packages for googleOauth
var GooglePassport_1 = require("./GooglePassport");
var session = require("express-session");
var passport = require('passport');
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.googlePassportObj = new GooglePassport_1["default"]();
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.Songs = new SongModel_1.SongModel();
        this.Users = new UserModel_1.UserModel();
        this.Reviews = new ReviewModel_1.ReviewModel();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.expressApp.use(logger('dev'));
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(session({ secret: 'elevator music' }));
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());
    };
    //check if user is authenticated with googleOauth
    App.prototype.validateAuth = function (req, res, next) {
        // if(req.user) {
        //     console.log("user is authenticated");
        //     return next();
        // }
        if (req.isAuthenticated()) {
            console.log("user is authenticated");
            return next();
        }
        console.log("user is not authenticated");
        res.redirect('/');
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));
        router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/#/newsong', failureRedirect: '/' }));
        router.get('/songs/raw/:trackID', function (req, res) {
            res.set('content-type', 'audio/mp3');
            res.set('accept-ranges', 'bytes');
            var trackid = new mongoose.Types.ObjectId(req.params.trackID);
            var gridfs = require('mongoose-gridfs')({
                mongooseConnection: mongoose.connection
            });
            mongoose.File = gridfs.model;
            var downloadStream = mongoose.File.readById(trackid);
            var count = 0;
            downloadStream.on('data', function (chunk) {
                console.log("received chunk :" + count);
                count++;
                res.write(chunk);
            });
            downloadStream.on('error', function () {
                console.log("received error");
                res.sendStatus(404);
            });
            downloadStream.on('close', function () {
                console.log("closing stream");
                res.end();
            });
        });
        //get all users; unlikely this will be used other than internally
        router.get('/users', function (req, res) {
            console.log("Requesting all users in db");
            _this.Users.retrieveAllUsers(res);
        });
        // get a specific user by musicianid to populate musician info for a song
        router.get('/users/:musicianid', function (req, res) {
            var musid = req.params.musicianid;
            console.log("Requesting a specific user with _id: " + musid);
            _this.Users.retrieveUser(res, { _id: musid });
        });
        // get all songs by a user by _id
        router.get('/users/:musicianid/songs', function (req, res) {
            var musid = req.params.musicianid;
            console.log("Requesting all songs for a user with _id: " + musid);
            _this.Songs.retrieveSong(res, { musician: musid });
        });
        //get all reviews by a user by _id
        router.get('/users/profile/reviews/:id', function (req, res) {
            var id = req.params.id;
            console.log("Requesting all review for user with id: " + id);
            _this.Reviews.retrieveReviewWithId(res, { user_id: id });
        });
        //get a specific user by email to fill profile information for a user
        router.get('/profile', function (req, res) {
            console.log("Requesting a specific user with email: " + _this.googlePassportObj.email);
            _this.Users.retrieveUser(res, { email: _this.googlePassportObj.email });
        });
        //requesting meta data for a song by song _id
        router.get('/songs/meta/:songid', function (req, res) {
            var songid = req.params.songid;
            console.log("Requesting meta data for song with _id: " + songid);
            _this.Songs.retrieveSong(res, { _id: songid });
        });
        //get reviews by review _id
        router.get('/reviews/:reviewid', function (req, res) {
            var reviewid = req.params.reviewid;
            console.log("Requesting review with _id: " + reviewid);
            _this.Reviews.retrieveReviewWithId(res, { _id: reviewid });
        });
        //get all reviews in the db : for testing
        router.get('/reviews', function (req, res) {
            console.log("Requesting all reviews");
            _this.Reviews.retrieveAllReviews(res);
        });
        //get random song from the database using mongo simple-random
        router.get('/randomsong', function (req, res) {
            _this.Songs.retrieveRandom(res);
        });
        router.post('/upload/review/:userid/:songid/:content/:rating', function (req, res) {
            console.log('posting!');
            var reviewid = new mongoose.Types.ObjectId();
            var review = {
                _id: reviewid,
                user_id: req.params.userid,
                song_id: req.params.songid,
                review_content: req.params.content,
                date: new Date(),
                rating: req.params.rating
            };
            _this.Reviews.uploadReview(review);
            _this.Users.bindReviewToUser(req.params.userid, reviewid);
        });
        this.expressApp.use('/', router);
        this.expressApp.use('/', express.static(__dirname + '/angularSrc'));
    };
    return App;
}());
exports.App = App;
