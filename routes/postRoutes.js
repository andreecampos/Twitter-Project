const express = require("express");
const app = express();
//done the router
const router = express.Router();

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');


//--------12.2 Creating the pots route---------
router.get("/:id", (req, res,  next) => {

    const payload ={
        pageTitle: "View post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id //the post id
    }
    res.status(200).render("postPage", payload);
  })
  
module.exports  = router;
