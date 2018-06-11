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
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
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
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.get('/songs/raw/:trackID', function (req, res) {
            res.set('content-type', 'audio/mp3');
            res.set('accept-ranges', 'bytes');
            var trackid = new mongoose.Types.ObjectId(req.params.trackID);
            var gridfs = require('mongoose-gridfs')({
                mongooseConnection: mongoose.connection
            });
            mongoose.File = gridfs.model;
            var downloadStream = mongoose.File.readById(trackid);
            downloadStream.on('data', function (chunk) {
                res.write(chunk);
            });
            downloadStream.on('error', function () {
                res.sendStatus(404);
            });
            downloadStream.on('close', function () {
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
        //get all reviews by a user by _id
        router.get('/users/profile/reviews/:id', function (req, res) {
            var id = req.params.id;
            console.log("Requesting all review for user with id: " + id);
            _this.Reviews.retrieveReviewWithId(res, { user_id: id });
        });
        //get a specific user by email to fill profile information for a user
        router.get('/users/profile/:email', function (req, res) {
            var email = req.params.email;
            console.log("Requesting a specific user with email: " + email);
            _this.Users.retrieveUser(res, { email: email });
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
        //get random song from the database using mongo simple-random
        router.get('/randomsong', function (req, res) {
            _this.Songs.retrieveRandom(res);
        });
        this.expressApp.use('/', router);
        //this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        this.expressApp.use('/', express.static(__dirname + '/angularSrc'));
    };
    return App;
}());
exports.App = App;
