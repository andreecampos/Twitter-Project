const express = require("express");
const app = express();
const PORT = 3000;
const middleware = require ('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database") //dont need "mongoose", because allt are i database.js



//Tell our server which template are  we gonna use
app.set("view engine", "pug");
//Tell our server where to look for these pug files when it wants  to  use it
app.set("views", "views");//when you need at template(views), go to the folder call views

app.use(bodyParser.urlencoded({ extended: false }));

/*specify that everything inside this path, which is "public" folder. Everything inside the public folder
is to  be served as a static file */
app.use(express.static(path.join(__dirname, "public")));

// ----- ROUTES----
// declared our  login  route in this const
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes');


// we say to app use it, and should handle
app.use("/login", loginRoute);
app.use("/register", registerRoute);

//---------------
//we put the middleware, which is the function from middleware.js
app.get("/", middleware.requireLogin,(req, res,  next) => {
    //payload, term used to refer to the data we're sending to function or to a page or throught a request
    //we send data to our server  through our template and render that dynamically
    const payload ={
        pageTitle: "Home"
    }
    res.render("home", payload);
  });



app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});