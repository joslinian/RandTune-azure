import Mongoose = require("mongoose");
import {DataAccess} from './../DataAccess';
import {ISongModel} from '../interfaces/ISongModel';

let random = require('mongoose-simple-random')
let mongooseConnection = DataAccess.mongooseConnection;
let mongooseObj = DataAccess.mongooseInstance;

class SongModel {
    public schema:any;
    public model:any;


    public constructor() {
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = new Mongoose.Schema(
            {
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
            }, {collection: 'songs'}
        );
        this.schema.plugin(random);
    }

    public createModel(): void {
        this.model = mongooseConnection.model<ISongModel>("Song", this.schema);
    }

    public retrieveSong(res:any, target:Object){
        var query = this.model.find(target);
        query.exec((err,song)=> {
            res.json(song);
        });
    }

    public retrieveRandom(res:any){
        this.model.findOneRandom(function(err, result) {
              res.json(result);
          });
    }
}
export {SongModel};