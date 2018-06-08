"use strict";
exports.__esModule = true;
var Mongoose = require("mongoose");
var DataAccess_1 = require("./../DataAccess");
var random = require('mongoose-simple-random');
var mongooseConnection = DataAccess_1.DataAccess.mongooseConnection;
var mongooseObj = DataAccess_1.DataAccess.mongooseInstance;
var SongModel = /** @class */ (function () {
    function SongModel() {
        this.createSchema();
        this.createModel();
    }
    SongModel.prototype.createSchema = function () {
        this.schema = new Mongoose.Schema({
            // Public song info
            title: String,
            description: String,
            album: String,
            genre: String,
            // determines reviewability status
            review_count: Number,
            // user id
            musician: String,
            // mp3 file id
            mp3_id: String
        }, { collection: 'songs' });
        this.schema.plugin(random);
    };
    SongModel.prototype.createModel = function () {
        this.model = mongooseConnection.model("Song", this.schema);
    };
    SongModel.prototype.retrieveSong = function (res, target) {
        var query = this.model.find(target);
        query.exec(function (err, song) {
            res.json(song);
        });
    };
    SongModel.prototype.retrieveRandom = function (res) {
        this.model.findOneRandom(function (err, result) {
            res.json(result);
        });
    };
    return SongModel;
}());
exports.SongModel = SongModel;
