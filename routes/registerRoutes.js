const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")

app.set("view engine", "pug");
app.set("views", "views");

//setting up the body parser
/* extended : false, means the body will only be able  to  contain
key value pairs made up of strings or  arrays. if is true instead af false
means that any data type can come trough*/
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res,  next) => {
    res.render("register");//es register.pug
  })
//change to post to handle that submission. we used method POST i register.pug
router.post("/", (req, res,  next) => {
    
    //we use all data from user
    //console.log(req.body);
    //we create some variables with all the data from user, that we can use. .trim will remove the spaces
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password; //we dont trim password beacuse  the users can use space
     /*create payload which will pass to the register page. Payload is
     all the date from inpust*/
    const payload  = req.body;

    if(firstName && lastName && username && email && password){

    }
    else{
     
      payload.errorMessage = "Make sure each field has  a valid value ";
      res.render("register", payload);//es register.pug
    }
    
  })


module.exports  = router;