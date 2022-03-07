const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")//with body parser send the data when you submit form to request body
// ------4.20 Hashing the  password -----
//npm install bcrypt and then get the package, we are going  to  hash the password before 
//we send to the database
const bcrypt = require("bcrypt");

//include UserSchema from this field
const User = require('../schemas/UserSchema');

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
router.post("/", async (req, res,  next) => {
    
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
      /* - make sure that no user exists with this email or username
        - //going to look for one document in the collection. Look for a user
        that has the email and username because is unique value (Checking if username or emails are already in use)
      */ 
     //----------------  4.16 Async and  Await ------------
     /* we use a async in the fuction, an then use await to wait for the result
      it wont move on to the next line until user has  return */
      const user = await User.findOne({ //---------- 4.15 Checking if username or emails are already in use -----------
        $or: [ //or is a  condition and all in the brackets
          //--- 4.15 --- go to the user table and look for any row with the username of user
          //----4.15 ---- this username matches with the user schema
          { username: username}, 
          { email: email} 
        ]
      })
      //------------------- 4.17 Checking if the username or email are already in use ---------
      .catch((error)=>{
        console.log(error);
        payload.errorMessage = "someting were wrong ";
      res.render("register", payload);//es register.pug
      })
     //------------------- 4.17 Checking if the username or email are already in use ---------
      if(user == null){
          //no user found
          //------------- 4.18 inserting a user into the collection -----
          //data = req.body already have all the fieelds that they entered
          var data = req.body;
        //-------- 4.20------
        //the hash fuction takes a couplee af parameters. The first parameter  is the value
        //that we  are going to hash, in  this case "password". The second is the salt rounds
        //which does how many times it is going to do the hashing calculation(a higer number means very  secure)
        data.password = await bcrypt.hash(password, 10) //check Cristiano ronaldo in mongodb, he has hash password



          User.create(data)
          //remember that mongodb returns a promise which means it operates asynchronously
          //so we need  to specify a then() block, which is the code that is going to do afterwards
          .then((user)=>{
              //console.log(user)//we console.logour user data
            // ---------- 4.21 ------------
            //we are storing the logged in user or the newly created user, in the  session at the user
            //property because that is what we are checking  in the middleware
            req.session.user = user; 
            //we redirect the user to the home page
            return  res.redirect("/");
          })

      }
      else {
        //user  found
        if(email == user.email){
          payload.errorMessage = "Email already in use";
        } else {
          payload.errorMessage = "Username already in use";
        }
        res.render("register", payload);
      }
    }
    else{
     
      payload.errorMessage = "Make sure each field has  a valid value ";
      res.render("register", payload);//es register.pug
    }
    
  })


module.exports  = router;