import Mongoose = require("mongoose");
import {DataAccess} from './../DataAccess';
import {IUserModel} from '../interfaces/IUserModel';

let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class UserModel {
    public schema:any;
    public model:any;

    public constructor() {
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = new Mongoose.Schema(
            {
                // a user's public screen name (not unique) 
                username: String,
                // email (unique) and password are used to login
                email: String,
                password: String,
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
                reviews:[{ reviewID: String }],
                // an array of a user's songs (if any)
                songs:[{ songID: String }]
            }, {collection: 'users'}
        );
    }

    public createModel(): void {
        this.model = mongooseConnection.model<IUserModel>("User", this.schema);
    }

    // retrieve a user using a filter
    public retrieveUser(response:any, filter:Object){
        var query = this.model.findOne(filter);
        query.exec((err,results)=> {
            response.json(results);
        });
    }

    // retrieve all users from the database
    public retrieveAllUsers(response:any){
        var query = this.model.find({});
        query.exec((err,results)=> {
            response.json(results);
        });
    }

    // add a review to a users collection
    public bindReviewToUser(userId:any, reviewId:any){
        var id = new Mongoose.Types.ObjectId(userId);
        var idVal = reviewId.valueOf();
        this.model.findOne({_id: id}, function(err, doc){
            doc.reviews.push({reviewID: idVal});
            doc.save();
        });
    }

}
export {UserModel};