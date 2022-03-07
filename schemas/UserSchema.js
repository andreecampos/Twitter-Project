const mongoose = require('mongoose');

//declaring mongoose.Schema
const Schema = mongoose.Schema;

//create a schema for our user
const UserSchema = new Schema({
    //add field
    firstName: { type: String, require: true, trim: true},
    lastName: { type: String, require: true, trim: true},
    username: { type: String, require: true, trim: true, unique: true},// unique value, no other item can have the same username
    email: { type: String, require: true, trim: true, unique: true},
    password: { type: String, require: true},
    profilePic: { type: String, default: "/images/profilePic.jpeg"}, // user get a default picturee when  they sign up
    likes: [{type: Schema.Types.ObjectId, ref: 'Post'}],//9.1come from PostSchema
    retweets: [{type: Schema.Types.ObjectId, ref: 'Post'}]
 
    //-------------- 4.19 adding timestamps to our  data -----------
}, { timestamps: true});//we use timestamps to know when the user manually update the fields (exampel: posts, when you send a message ). check mongodb "updateAt"
/*we declared a mongoose schema for the user and we have exported it
and any connection to our database will have access to this schema by
accessing the 'User' property */ 
const User = mongoose.model('User', UserSchema);
module.exports = User;
