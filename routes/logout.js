const express = require("express");
const app = express();
//5.7--------Logging out-----------
// we capied loginRoutes.js here, we get everyting except from the top request
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');



app.use(bodyParser.urlencoded({ extended: false }));



router.get("/", (req, res,  next) => {

    //5.7 if the  session is set,if this is null it wont hit this is statement 
    if(req.session){
        req.session.destroy(()=>{
            res.redirect("/login")//5.7 efter destroy take the user to the login page
        })
    }
  })




module.exports  = router;
