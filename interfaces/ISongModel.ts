import Mongoose = require("mongoose");

interface ISongModel extends Mongoose.Document {
    // Public song info
    title: string;
    description: string;
    album: string;
    genre: string;
    // determines reviewability status
    review_count: number;
    // user id
    musician: string;
    // mp3 file id
    mp3_id: string;
}
export {ISongModel};