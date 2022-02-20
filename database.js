const mongoose = require("mongoose");

//create a connect function
class Database {

    /*call connect funtion in the constructor.Constructor is
    the code that is called or ran when an instancee of this class
    (Database) is created.Constructor is the first thing we are  going to run 
    in this class
    */
    
    constructor(){
        this.connect();
    }
    connect() {
        mongoose.connect("mongodb://localhost/twitter")
        .then(()=>{
        console.log("database connection successful");
        })
        .catch((err)=>{
        console.log("database connection error" + err);
        })
    }
}

module.exports = new Database();