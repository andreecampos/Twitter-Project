/* we declared this middleware.js, who has a require login function.
-we call require login (function). This function takes the req res next
objects as parameters. then we're checking if the session prroperty
is set on the request, if is set so we check if the user property is
also set  or  exists. This mean that user is logged in. if doesn't exists we sen to  
redirect  /login route
*/
exports.requireLogin = (req,res,next) =>{
    if(req.session && req.session.user) {
        //next passes it on to the next  step in the request
        //next is called from here and will take the function in app.js "Home"
        return next();
    }
    else {
        return res.redirect('/login');
    }
}