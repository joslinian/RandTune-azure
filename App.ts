import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import * as stream from 'stream';

//var Q = require('q');

import { SongModel } from './model/SongModel';
import { UserModel } from './model/UserModel';
import { ReviewModel } from './model/ReviewModel';
import { DataAccess } from './DataAccess';
var fs = require('fs');
var mongoose = require('mongoose');

//import necessary packages for googleOauth
import GooglePassportObj from './GooglePassport';
let passport = require('passport');


// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public expressApp: express.Application;

    //ref to app models
    public Songs: SongModel;
    public Users: UserModel;
    public Reviews: ReviewModel;

    //ref to google passport
    public googlePassportObj: GooglePassportObj;

    //Run configuration methods on the Express instance.
    constructor() {
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.Songs = new SongModel();
        this.Users = new UserModel();
        this.Reviews = new ReviewModel();
        this.googlePassportObj = new GooglePassportObj();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.expressApp.use(logger('dev'));
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(passport.initialize());
        this .expressApp.use(passport.session());
    }

    //check if user is authenticated with googleOauth
    private validateAuth(req, res, next):void {
        if (req.isAuthenticated()) { console.log("user is authenticated"); return next(); }
        console.log("user is not authenticated");
        res.redirect('/');
    }


    // Configure API endpoints.
    private routes(): void {
        let router = express.Router();

        router.get('/auth/google', 
            passport.authenticate('google', 
                { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }
            )
        );

        router.get('/auth/google/callback', 
            passport.authenticate('google', 
                { successRedirect: '/#/newsong', failureRedirect: '/' }
            )
        );

        router.get('/songs/raw/:trackID', (req, res) => {
            res.set('content-type', 'audio/mp3');
            res.set('accept-ranges', 'bytes');
            var trackid = new mongoose.Types.ObjectId(req.params.trackID);
            var gridfs = require('mongoose-gridfs')({
                mongooseConnection: mongoose.connection
            });
            mongoose.File = gridfs.model;
            var downloadStream = mongoose.File.readById(trackid);
            var count = 0;
            downloadStream.on('data', (chunk) => {
                console.log("received chunk :" + count);
                count++;
                res.write(chunk);
            });

            downloadStream.on('error', () => {
                console.log("received error");
                res.sendStatus(404);
            });

            downloadStream.on('close', () => {
                console.log("closing stream");
                res.end();
            });
        });



        //get all users; unlikely this will be used other than internally
        router.get('/users', (req, res) => {
            console.log("Requesting all users in db");
            this.Users.retrieveAllUsers(res);
        })

        // get a specific user by musicianid to populate musician info for a song
        router.get('/users/:musicianid', (req, res) => {
            var musid = req.params.musicianid;
            console.log("Requesting a specific user with _id: " + musid);
            this.Users.retrieveUser(res, { _id: musid });
        })

        //get all reviews by a user by _id
        router.get('/users/profile/reviews/:id', (req, res) => {
            var id = req.params.id;
            console.log("Requesting all review for user with id: " + id);
            this.Reviews.retrieveReviewWithId(res, { user_id: id });
        })

        //get a specific user by email to fill profile information for a user
        router.get('/users/profile/:email', (req, res) => {
            var email = req.params.email;
            console.log("Requesting a specific user with email: " + email);
            this.Users.retrieveUser(res, { email: email });
        })

        //requesting meta data for a song by song _id
        router.get('/songs/meta/:songid', (req, res) => {
            var songid = req.params.songid;
            console.log("Requesting meta data for song with _id: " + songid);
            this.Songs.retrieveSong(res, { _id: songid });
        })

        //get reviews by review _id
        router.get('/reviews/:reviewid', (req, res) => {
            var reviewid = req.params.reviewid;
            console.log("Requesting review with _id: " + reviewid);
            this.Reviews.retrieveReviewWithId(res, { _id: reviewid });
        })

        //get random song from the database using mongo simple-random
        router.get('/randomsong', (req, res) => {
            this.Songs.retrieveRandom(res);
        })



        this.expressApp.use('/', router);

        //this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        this.expressApp.use('/', express.static(__dirname + '/angularSrc'));

    }



}

export { App };