// 7.5 ---------- Creating the posts Mongoose schema -----------
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const PostSchema = new Schema({
    //7.5 add the date types
    content: {type: String, trim: true}, //content is the value of the post
    //7.5 postedBy value is the user that posted, ObjectId is the unique id
    postedBy:{type: Schema.Types.ObjectId, ref: 'User'},
    pinned: Boolean,
    //--------------- 9.1 Adding the likes field to the schemas ------
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],//9.1 is gonna be an array of user objects
    //10.2 keep track of how many users have retweeted this post
    retweetUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    //10.2 that retweet data field is going to be the post that is that we retweeted
    retweetData: {type: Schema.Types.ObjectId, ref: 'Post'},

}, { timestamps: true});
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
