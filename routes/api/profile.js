const express = require("express");
const app = express();
const router = express.Router();

const User = require('../../schemas/UserSchema');
//7.6 ------------ Inserting the  post into the database--------------
const Post = require('../../schemas/PostSchema');
const multer = require('multer')
const bodyParser = require("body-parser")
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null,'./images')
  },
  filename:(req, file, cb) =>{
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})


//app.use(bodyParser.urlencoded({ extended: false }));

/*
app.get("/", (req, res) =>{
    res.sendFile("profilePage", {roost:__dirname})
})

app.post("/subir", upload.single('archivo'),(req, res)=>{
    console.log(req.file)
    res.send("File lyckades skickas")
})

*/





router.get("/:username", async (req, res,  next) => {

   
    const user = await User.findOne({username: req.params.username})
     console.log(user);

    //8.2 we use this get to get pinned post,post for a certain person and ONLY PEOPLE  FOLLOW
     Post.find({postedBy:user._id})
    //8.4 we populate the user object 
   //.populate("postedBy") 
    .sort({"createdAt": -1}) //8.4 put the post in order from now to the least

    .then((results)=>{
        res.status(200).render("userPage", {posts: results, test:user})
        console.log(req.user)
    })
       .catch(error => {
        console.log(error);
       res.sendStatus(400);
    })

   
 })

 router.get("/:username", (req, res,  next) => {

   const payload ={
       pageTitle: "User Post",
       userLoggedIn: req.session.user,
       userLoggedInJs: JSON.stringify(req.session.user),
       userId: req.params.username //the post id
   }
   res.status(200).render("profilePage", payload);
 })



 function outputPosts(results, container){
    container.html("");
   //loopar over this list and every single iteration will be referred to as result.
    results.forEach(result =>{
           const html = createPostHtml(result ) //createPostHtml come from common.js
           container.append(html);
       });
       if(results.lengt == 0){
           container.append("<span class='noResults'>Nothing to show</span>")
       }
   }

 function createPostHtml(postData) {
    //return postData.content;

//-----------7.8 Outputting the post content---------
//7.8 postData contains all the data from the post collection in the database
//7.8 postedBy contains the data for the user
    const postedBy = postData.postedBy; 

    //8.4 Populating the posted by data
    if(postedBy._id === undefined){
        return console.log("User object not populated");    
    }

    //7.9 we want to put the users name , firstName and LastName
    const displayName= postedBy.firstName + " " + postedBy.lastName; 
    //7.9 timestamp //8.6 we call the function of the time
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    //----------- 9.13 Showing correct button colour when page loads----------
    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
     
// ------------------ 7.9 Outputting the  user info from  the post -------------
//-------7.10----7.11 ----7.12---CSS
//--------------9.3 Getting the post id from the clicked element----------
//9.3 add a  data attribute to the root object
    return `<div class='post' data-id='${postData._id}' > 
                    <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'> 
                        <form action="/subir" method="post" enctype="multipart/form-data">
                            <input type="file" name="archivo">
                        </form>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}'class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                        <div class='postButtonContainer'>
                                <button data-toggle = 'modal' data-target='#replyModal'>
                                    <i class='fa-solid fa-message'></i>
                                </button>
                        </div>
                        <div class='postButtonContainer green'>
                                <button class='retweetButton'>
                                    <i class='fa-solid fa-retweet'></i>
                                </button>
                        </div>
                        <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='fa-solid fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                        </div>

                        </div>
                    </div>
                    </div>
            </div>`;
}
 module.exports  = router;