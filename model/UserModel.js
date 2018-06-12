"use strict";
exports.__esModule = true;
var Mongoose = require("mongoose");
var DataAccess_1 = require("./../DataAccess");
var mongooseConnection = DataAccess_1.DataAccess.mongooseConnection;
var mongooseObj = DataAccess_1.DataAccess.mongooseInstance;
var UserModel = /** @class */ (function () {
    function UserModel() {
        this.createSchema();
        this.createModel();
    }
    UserModel.prototype.createSchema = function () {
        this.schema = new Mongoose.Schema({
            // a user's public screen name (not unique) 
            username: String,
            // email (unique) and password are used to login
            email: String,
            //google user id
            userId: String,
            // public description about user
            bio: String,
            // public profile links
            facebook: String,
            twitter: String,
            // private first and last name
            first_name: String,
            last_name: String,
            // private phone number potentially for password reset
            phone: String,
            // a user's monetary account balance 
            balance: Number,
            // an array of user's submitted reviews
            reviews: [{ reviewID: String }],
            // an array of a user's songs (if any)
            songs: [{ songID: String }]
        }, { collection: 'users' });
    };
    UserModel.prototype.createModel = function () {
        this.model = mongooseConnection.model("User", this.schema);
    };
    // //find user in db
    // public findById(inId : any) : boolean {
    //     var query = this.model.findOne({userId: inId});
    //     query.exec((err,result)=> {
    //         return (result != null);
    //     });
    //     return false;
    // }
    // retrieve a user using a filter
    UserModel.prototype.retrieveUser = function (response, filter) {
        var query = this.model.findOne(filter);
        query.exec(function (err, results) {
            response.json(results);
        });
    };
    // retrieve all users from the database
    UserModel.prototype.retrieveAllUsers = function (response) {
        var query = this.model.find({});
        query.exec(function (err, results) {
            response.json(results);
        });
    };
    // add a review to a users collection
    UserModel.prototype.bindReviewToUser = function (userId, reviewId) {
        var id = new Mongoose.Types.ObjectId(userId);
        var idVal = reviewId.valueOf();
        this.model.findOne({ _id: id }, function (err, doc) {
            doc.reviews.push({ reviewID: idVal });
            doc.save();
        });
    };
    return UserModel;
}());
exports.UserModel = UserModel;
