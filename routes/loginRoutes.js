const express = require("express");
const app = express();
//done the router
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");
//configurate  the route to handlrequests
//we use router and not app.get, because this file is handling om routs
//and no traffic to the server which is what app's doing
router.get("/", (req, res,  next) => {
    res.render("login");
  })

//export it from this file  route, we can use it  in another places
module.exports  = router;
