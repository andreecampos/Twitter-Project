const express = require("express");
const app = express();
const PORT = 3000;
const middleware = require ('./middleware')
//const multer = require('multer')
//const ejs = require('ejs')
const path = require('path')
const multer = require('multer')
const bodyParser = require("body-parser")
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null,'./public/images')
  },
  filename:(req, file, cb) =>{
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})

const mongoose = require("./database") //dont need "mongoose", because allt are i database.js
//--------- 4.21 Sessions ----------
//npm install express-session, and the use the pakege installed on the page
const session = require("express-session");


//Tell our server which template are  we gonna use
app.set("view engine", "pug");
//Tell our server where to look for these pug files when it wants  to  use it
app.set("views", "views");//when you need at template(views), go to the folder call views


app.use(bodyParser.urlencoded({ extended: false }));

/*specify that everything inside this path, which is "public" folder. Everything inside the public folder
is to  be served as a static file */
app.use(express.static(path.join(__dirname, "public")));


app.use(express.static('./public'));

//-------- 4.21 --------------
//session  is  the object and we pass some  options.
app.use(session({
  secret:  "bbq chips",//secret hash  the session internally, that can be any string you want
  resave: true, //its  means saves the sessions back to the storage, even when the session didnt  get modified at any ponit during the  request
  saveUninitialized: false //prevents it from the sessions as uninitialized  as the name suggests

}))


// ----- ROUTES----
// declared our  login  route in this const
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logout');//5.7 we tell to app.js to use logout.js
const profileRoute = require('./routes/profileRoutes');
const postRoute = require('./routes/postRoutes');

const userRoute = require('./routes/api/profile');

//------API ROUTES -------
const postsApiRoute = require('./routes/api/posts');
const User = require("./schemas/UserSchema");
const { log } = require("console");

// we say to app use it, and should handle
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", postRoute);
app.use("/profile", userRoute);

app.use("/profile", middleware.requireLogin, profileRoute);//14.2

app.use("/api/posts", postsApiRoute);

//---------------
//we put the middleware, which is the function from middleware.js
app.get("/", middleware.requireLogin,(req, res,  next) => {
    //payload, term used to refer to the data we're sending to function or to a page or throught a request
    //we send data to our server  through our template and render that dynamically
    const payload ={
        pageTitle: "Home",
        //---------- 4.22 Passing the user logged in info to the page -------------
        //the reason is because, when we render the home page, maybe we want to 
        //show the users profile picture or name in the navigation bar.
        userLoggedIn: req.session.user,
        //9.11 it is gonna pass the user object as a value we can access using userLoggedInJs in the pug template(main-layout.pug)
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.render("home", payload);
  });







app.get("/", (req, res) =>{
    res.sendFile("profilePage", {roost:__dirname})
})

app.post("/subir", upload.single('archivo'),async (req, res)=>{
  console.log(req.session.user)
    await User.findOneAndUpdate({username:req.session.user.username }, {profilePic:  `/images/${req.file.filename}`})
    res.send("File lyckades skickas")
})








app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});