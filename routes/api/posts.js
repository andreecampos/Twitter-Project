//7.3 ---------- POST API route -------
// 7.2  is essentially the  file which handles that calls from common.js
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/UserSchema');
//7.6 ------------ Inserting the  post into the database--------------
const Post = require('../../schemas/PostSchema');


app.use(bodyParser.urlencoded({ extended: false }));


//7.3 router.get (handle a get request) and router.post to (hanlde the post request)
router.get("/", async (req, res,  next) => {
     //8.2 we use this get to get pinned post,post for a certain person and ONLY PEOPLE  FOLLOW
        Post.find()
     //8.4 we populate the user object 
     .populate("postedBy") 
     .sort({"createdAt": -1}) //8.4 put the post in order from now to the least
     .then((results)=>{
         res.status(200).send(results)
     })
        .catch(error => {
         console.log(error);
        res.sendStatus(400);
     })
    
  })

router.get("/", async (req,res,next)=>{
    const results= await getPosts({});
    res.status(200).send(results);

})

router.get("/:id", async (req, res,  next) => {
   
    const postId = req.params.id

    const results = await getPosts({_id: postId});
    res.status(200).send(results);
    console.log(results);
    /*return res.status(200).send("this is awesome")
    Post.find()
   
    .populate("postedBy") 
    .sort({"createdAt": -1}) 
    .then((results)=>{
        res.status(200).send(results)
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })*/
    
   
 })



router.post("/", async (req, res,  next) => {
    //7.4  --------- Sending a bad request when the data is invalid--------
    //7.4  is  content does not exist
        if(!req.body.content){
            console.log("Content param not sent with request");
           return  res.sendStatus(400);
        }

        //7.6 Call post.create

        const postData ={
            content: req.body.content,
            postedBy: req.session.user //7.6 gett he user who posted it
        }
        Post.create(postData)
        .then(async newPost=>{ //7.6 newPost is then new data that was just created 
            //7.6 we take the new post, and tell to populate that field. {path: "postedBy"} there  we  specify which field we want to populate
            newPost = await User.populate(newPost, {path: "postedBy"})
            res.status(201).send(newPost)//7.6 signal that something has been  created succesfully
           
        })
        .catch(error =>{
            console.log(error);
            res.sendStatus(400);
        })

     
  })

  //9.5 handling the PUT request
  router.put("/:id/like", async (req, res,  next) => {
        const postId = req.params.id;//9.6
        const userId = req.session.user._id;//9.6
        
        //9.6 this contain true or false based on whether the post id exists in their likes or not
        const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);//9.6 likes is the array
     

        //------------------ 9.7 Inserting the like ------------ 
        //9.7 we can use $pull to remove likes 
        const option = isLiked ? "$pull" : "$addToSet";
        //9.7 we get Likes in a array i mongodb   //----------------- 9.8 Unliking posts---------------
        //9.8 findByIdAndUpdate will update the value and give us back the newly updated document//insert user like
        req.session.user = await User.findByIdAndUpdate(userId,{ [option] : {likes: postId}}, {new: true}) //9.7 add postId to the likes value likes: postId
        .catch(error => { //9.8 add a catch block in case that get wrong
            console.log(error);
            res.sendStatus(400);
        })
        //-------------- 9.9 Returning the like result to the client ---------------//insert post like
        const post = await Post.findByIdAndUpdate(postId,{ [option] : {likes: userId}}, {new: true}) 
        .catch(error => { 
            console.log(error);
            res.sendStatus(400);
        })
      


    res.status(200).send(post)
  })
  //10.1
  router.post("/:id/retweet", async (req, res,  next) => {
      
    const postId = req.params.id;
    const userId = req.session.user._id;
    
    //------------10.2 Adding the retweet fields to the schema-----------
    //10.2 try and delete retweet
    const deletedPost = await Post.findOneAndDelete({postedBy: userId, reweetData: postId})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    const option = deletedPost != null ? "$pull" : "$addToSet";
    //----------10.3 Retweeting posts--------
    const repost = deletedPost;
    //10.3 there was nothing to  delete so repost was null, we created the post
    if(repost == null) {
        repost = await Post.create({postedBy: userId, reweetData: postId })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    }
    


    req.session.user = await User.findByIdAndUpdate(userId,{ [option] : {retweets: repost._id}}, {new: true}) 
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
   
    const post = await Post.findByIdAndUpdate(postId,{ [option] : {retweetUsers: userId}}, {new: true}) 
    .catch(error => { 
        console.log(error);
        res.sendStatus(400);
    })
  


res.status(200).send(post)
})

async function getPosts(filter){

    
     
    const results = await Post.findOne(filter)
   
    .populate("postedBy") 
    .sort({"createdAt": -1})
    .catch(error => console.log(error))
    
    return results = await User.populate(results);

   
}

//export it from this file  route, we can use it  in another places
module.exports  = router;
