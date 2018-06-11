import Mongoose = require("mongoose");

class DataAccess {
    static mongooseInstance: any;
    static mongooseConnection: Mongoose.Connection;
    //static DB_CONNECTION_STRING:string = 'mongodb://admin:randtuneadmin@ds016298.mlab.com:16298/randtune';
    static DB_CONNECTION_STRING:string = 'mongodb://exampleuser:music123@ds042908.mlab.com:42908/randtune';
    constructor () {
        DataAccess.connect();
    }
    
    static connect (): Mongoose.Connection {
        // if already connected return connection
        if(this.mongooseInstance) return this.mongooseInstance;
        
        this.mongooseConnection  = Mongoose.connection;
        this.mongooseConnection.on("open", () => {
            console.log("Connected to mongodb.");
        });
        
        console.log("before connecting to mongo");
        this.mongooseInstance = Mongoose.connect(this.DB_CONNECTION_STRING);
        return this.mongooseInstance;
    }
    
}
console.log("before connecting to mongo")
DataAccess.connect();
export {DataAccess};