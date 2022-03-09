const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require ('../schemas/UserSchema');
const multer = require("multer")



router.get("/", async (req, res, next) => {
    
    const user = await User.findOne({username:req.session.user.username })
 const payload = {
     pageTitle: user.username,
     userLoggedIn: user,
     userLoggedInJs: JSON.stringify(user),
     profileUser:user,
     posts:[]
 }
 res.status(200).render("profilePage",payload);
})



async function getPayload(username, userLoggedIn){

    const user = await User.findOne({username: username})

    if(user == null) {

         user = await User.findById({username: username})
         
        if(user == null) {
            return{
                pageTitle:"User not found",
                userLoggedIn: userLoggedIn,
                userLoggedInJs : JSON.stringify(userLoggedIn),
                
            }
        }
    }
    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs : JSON.stringify(userLoggedIn),
        profileUser:user
    }

}
module.exports = router;
