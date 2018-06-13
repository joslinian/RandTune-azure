import Mongoose = require("mongoose");
import {DataAccess} from './../DataAccess';
import {IReviewModel} from '../interfaces/IReviewModel';

let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class ReviewModel{
    public schema: any;
    public model: any;

    public constructor(){
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = new Mongoose.Schema({
            _id: Mongoose.Schema.Types.ObjectId,
            user_id: String,
            song_id: String,
            review_content: String,
            date: Date,
            rating: Number
        }), {collection: 'reviews'}
    }

    public createModel(): void {
        this.model = mongooseConnection.model<IReviewModel>("Review", this.schema);
    }

    public retrieveReviewWithId(response:any, id:Object){
        var query = this.model.find(id);
        query.exec((err,itemArray)=> {
            response.json(itemArray);
        });
    }

    public uploadReview(review:any){
        var newReview = new this.model(review);
        this.model.create(review);
        // add error handling?
    }

    public retrieveAllReviews(response:any){
        var query = this.model.find();
        query.exec((err,itemArray)=> {
            response.json(itemArray);
        });
    }

}

export {ReviewModel}