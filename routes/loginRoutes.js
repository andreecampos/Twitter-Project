const express = require("express");
const app = express();
//done the router
const router = express.Router();
//---------- 4.23 -----------
//we have to use bodyparser and schemas and bcrypt
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));


//configurate  the route to handlrequests
//we use router and not app.get, because this file is handling om routs
//and no traffic to the server which is what app's doing
router.get("/", (req, res,  next) => {
    res.render("login");
  })
  //-------- 4.23 Logging in ---------
  //we are going to  handle the loggin, so we can logga in
router.post("/", async (req, res,  next) => {
    const payload  = req.body;
  //logUsername and logPassword come from values in login.pug
  //we use body parser so we can get data from the body in otherwise  this body property down woulndt exist
  //we put the erroMessage in login.puh with the values. value=logUsername, it means if the value  vas set is
  //gonna put into  the text box  again
  if(req.body.logUsername && req.body.logPassword){
    //
    const user = await User.findOne({
      $or: [ //or is a  condition and all in the brackets
        { username: req.body.logUsername},
        { email: req.body.logUsername}
      ]
    })
    
    .catch((error)=>{
      console.log(error);
      payload.errorMessage = "someting were wrong ";
    res.render("login", payload);//es login.pug
    });
    if(user != null) {
      //is a function  to compare an unencrypted password with an encrypted  one
      //we compare logPassword(user just entered) with user.password(the encrypted password)
      const result = await bcrypt.compare(req.body.logPassword, user.password); 
        
      if(result === true){
              req.session.user =  user;//last user is from our user upp
              return res.redirect("/")

            }    
    }
      //handle the case where they dint log in correctly
      //I put outside so it works in both cases, if the password (result) or if the user wasnt found  at all
      payload.errorMessage = "Login credentials incorrect";
      return res.render("login", payload);//es login.pug

  }
  
  payload.errorMessage = "Make sure  each field has a  valid values";
  res.render("login");
  })


//export it from this file  route, we can use it  in another places
module.exports  = router;
