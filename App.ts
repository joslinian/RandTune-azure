import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as mongodb from 'mongodb';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as multer from 'multer';
import * as stream from 'stream';

import { DataAccess } from './DataAccess';
import { SongModel } from './model/SongModel';
import { UserModel } from './model/UserModel';
import { ReviewModel } from './model/ReviewModel';
// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;
  // mongoose models
  public Songs: SongModel;
  public Users: UserModel;
  public Reviews: ReviewModel;

  //need mongodb conn for raw song data
  public db;

  //Run configuration methods on the Express instance.
  constructor() {
    this.expressApp = express();
    this.dbConnection();
    this.middleware();
    this.routes();
    this.Songs = new SongModel();
    this.Users = new UserModel();
    this.Reviews = new ReviewModel();
  }

  //Use a mongoDB connection to fetch raw song data from db
  private dbConnection(): void {
    mongodb.MongoClient.connect('mongodb://exampleuser:music123@ds042908.mlab.com:42908/randtune', (err, database) => {
      
      //jonnie's mlab: mongodb://admin:randtuneadmin@ds016298.mlab.com:16298/randtune

      if (err) {
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
      }
      this.db = database;
      console.log('MP3 mongodb connection established');
    });
  }
  // Configure Express middleware.

  private middleware(): void {
    this.expressApp.use(logger('dev'));
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    console.log("after init middleware.")
  }

  // Configure API endpoints.
  private routes(): void {

    console.log("before init routes")

    let router = express.Router();

    // router.use((req, res, next) => {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //   next();
    // });

    // Get an mp3 file from the db
    // https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
    // http://mongodb.github.io/node-mongodb-native/3.0/api/GridFSBucket.html#openDownloadStream

    
    // router.get('/songs/raw/:mp3id', (req, res) => {
    //   var mp3Id = new mongodb.ObjectId(req.params.mp3id);
    //   console.log("Fetching data for mp3 with id: " + mp3Id);
    //   res.set('content-type', 'audio/mp3');
    //   res.set('accept-ranges', 'bytes');
    //   let bucket = new mongodb.GridFSBucket(this.db, {
    //     bucketName: 'fs'
    //   });
    //   let downloadStream = bucket.openDownloadStream(mp3Id);
    //   downloadStream.on('data', (chunk) => {
    //     res.write(chunk);
    //   });
    //   downloadStream.on('error', () => {
    //     res.sendStatus(418); // not actually an appropriate error
    //   });
    //   downloadStream.on('end', () => {
    //     res.end();
    //   });
    // });

    
    //get all users; unlikely this will be used other than internally
    router.get('/users', (req, res) => {
      console.log("Requesting all users in db");
      this.Users.retrieveAllUsers(res);
    });
    

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
    this.expressApp.use('/app/json', express.static(__dirname+'/app/json'));
    console.log("before configuring static route");
    this.expressApp.use('/', express.static(__dirname+'/angularDist'));

    console.log("after configuring routes");
  }

}

export { App };