"use strict";
exports.__esModule = true;
var express = require("express");
var logger = require("morgan");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
var SongModel_1 = require("./model/SongModel");
var UserModel_1 = require("./model/UserModel");
var ReviewModel_1 = require("./model/ReviewModel");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.expressApp = express();
        this.dbConnection();
        this.middleware();
        this.routes();
        this.Songs = new SongModel_1.SongModel();
        this.Users = new UserModel_1.UserModel();
        this.Reviews = new ReviewModel_1.ReviewModel();
    }
    //Use a mongoDB connection to fetch raw song data from db
    App.prototype.dbConnection = function () {
        var _this = this;
        mongodb.MongoClient.connect('mongodb://exampleuser:music123@ds042908.mlab.com:42908/randtune', function (err, database) {
            //jonnie's mlab: mongodb://admin:randtuneadmin@ds016298.mlab.com:16298/randtune
            if (err) {
                console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
            }
            _this.db = database;
            console.log('MP3 mongodb connection established');
        });
    };
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.expressApp.use(logger('dev'));
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        console.log("after init middleware.");
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        console.log("before init routes");
        var router = express.Router();
        // router.use((req, res, next) => {
        //   res.header("Access-Control-Allow-Origin", "*");
        //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //   next();
        // });
        // Get an mp3 file from the db
        // https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
        // http://mongodb.github.io/node-mongodb-native/3.0/api/GridFSBucket.html#openDownloadStream
        router.get('/songs/raw/:mp3id', function (req, res) {
            var mp3Id = new mongodb.ObjectId(req.params.mp3id);
            console.log("Fetching data for mp3 with id: " + mp3Id);
            res.set('content-type', 'audio/mp3');
            res.set('accept-ranges', 'bytes');
            var bucket = new mongodb.GridFSBucket(_this.db, {
                bucketName: 'fs'
            });
            var downloadStream = bucket.openDownloadStream(mp3Id);
            downloadStream.on('data', function (chunk) {
                res.write(chunk);
            });
            downloadStream.on('error', function () {
                res.sendStatus(418); // not actually an appropriate error
            });
            downloadStream.on('end', function () {
                res.end();
            });
        });
        // //get all users; unlikely this will be used other than internally
        // router.get('/users', (req, res) => {
        //   console.log("Requesting all users in db");
        //   this.Users.retrieveAllUsers(res);
        // })
        //get a specific user by musicianid to populate musician info for a song
        // router.get('/users/:musicianid', (req, res) => {
        //   var musid = req.params.musicianid;
        //   var id = new mongodb.ObjectId(musid)
        //   console.log("Requesting a specific user with _id: " + musid);
        //   this.Users.retrieveUser(res, { _id: id });
        // })
        // //get all reviews by a user by _id
        // router.get('/users/profile/reviews/:id', (req, res) => {
        //   var id = req.params.id;
        //   console.log("Requesting all review for user with id: " + id);
        //   this.Reviews.retrieveReviewWithId(res, {user_id: id});
        // })
        // //get a specific user by email to fill profile information for a user
        // router.get('/users/profile/:email', (req, res) => {
        //   var email = req.params.email;
        //   console.log("Requesting a specific user with email: " + email);
        //   this.Users.retrieveUser(res, {email: email});
        // })
        // //requesting meta data for a song by song _id
        // router.get('/songs/meta/:songid', (req, res) => {
        //   var songid = req.params.songid;
        //   console.log("Requesting meta data for song with _id: " + songid);
        //   var id = new mongodb.ObjectId(songid);
        //   this.Songs.retrieveSong(res, { _id: id });
        // })
        // //get reviews by review _id
        // router.get('/reviews/:reviewid', (req, res) => {
        //   var reviewid = req.params.reviewid;
        //   console.log("Requesting review with _id: " + reviewid);
        //   var id = new mongodb.ObjectId(reviewid);
        //   this.Reviews.retrieveReviewWithId(res, { _id: id });
        // })
        // //get random song from the database using mongo simple-random
        // router.get('/randomsong', (req, res) => {
        //   this.Songs.retrieveRandom(res);
        // })
        // router.post('/upload/review/:userid/:songid/:content/:rating', (req, res) => {
        //   var reviewid = new mongodb.ObjectId();
        //   var review = {
        //     _id: reviewid,
        //     user_id: req.params.userid,
        //     song_id: req.params.songid,
        //     review_content: req.params.content,
        //     date: new Date(),
        //     rating: req.params.rating
        //   };
        //   this.Reviews.uploadReview(review);
        //   this.Users.bindReviewToUser(req.params.userid, reviewid);
        // })
        this.expressApp.use('/', router);
        console.log("before configuring static route");
        //this.expressApp.use('/', express.static(__dirname + '/pages'));
        this.expressApp.use('/', express.static(__dirname + '/angularDist'));
        console.log("after configuring routes");
    };
    return App;
}());
exports.App = App;
