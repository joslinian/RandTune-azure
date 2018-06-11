"use strict";
exports.__esModule = true;
var Mongoose = require("mongoose");
var DataAccess = /** @class */ (function () {
    function DataAccess() {
        DataAccess.connect();
    }
    DataAccess.connect = function () {
        // if already connected return connection
        if (this.mongooseInstance)
            return this.mongooseInstance;
        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.on("open", function () {
            console.log("Connected to mongodb.");
        });
        console.log("before connecting to mongo");
        this.mongooseInstance = Mongoose.connect(this.DB_CONNECTION_STRING);
        return this.mongooseInstance;
    };
    //static DB_CONNECTION_STRING:string = 'mongodb://admin:randtuneadmin@ds016298.mlab.com:16298/randtune';
    DataAccess.DB_CONNECTION_STRING = 'mongodb://exampleuser:music123@ds042908.mlab.com:42908/randtune';
    return DataAccess;
}());
exports.DataAccess = DataAccess;
console.log("before connecting to mongo");
DataAccess.connect();
