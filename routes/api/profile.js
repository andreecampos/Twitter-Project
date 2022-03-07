const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/UserSchema');
//7.6 ------------ Inserting the  post into the database--------------
const Post = require('../../schemas/PostSchema');



router.get("/:username", async (req, res,  next) => {

    const user = await User.findOne({username: req.params.username})
    console.log(user);

    //8.2 we use this get to get pinned post,post for a certain person and ONLY PEOPLE  FOLLOW
       Post.find({postedBy:user._id})
    //8.4 we populate the user object 
   //.populate("postedBy") 
    .sort({"createdAt": -1}) //8.4 put the post in order from now to the least
    .then((results)=>{
        res.status(200).send(results)
    })
       .catch(error => {
        console.log(error);
       res.sendStatus(400);
    })
    
   
 })


 module.exports  = router;