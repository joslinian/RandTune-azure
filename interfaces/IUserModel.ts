import Mongoose = require("mongoose");

interface IUserModel extends Mongoose.Document {
    // a user's public screen name (not unique) 
    username: string;
    // email (unique) and password are used to login
    email: string;
    // public description about user
    bio: string;
    // public profile links
    facebook: string;
    twitter: string;
    // private first and last name
    first_name: string;
    last_name: string;
    // private phone number potentially for password reset
    phone: string;
    // a user's monetary account balance 
    balance: number;
    // an array of user's submitted reviews
    reviews:[{ reviewID: string; }];
    // an array of a user's songs (if any)
    songs:[{ songID: string; }];
}
export {IUserModel};