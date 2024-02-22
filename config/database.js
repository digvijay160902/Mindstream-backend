// this file is used to connect to  database

const mongoose = require('mongoose');

// to use database_url we require env

require("dotenv").config(); // this load evn into in process object


//now function to connecttothe db
const connectToDB = ()=>{

    // it is promise so then and catch
    mongoose.connect(process.env.DATABASE_URL,{
        ssl: true,
        
    })
    .then(console.log("connection made successfully"))
    .catch((err)=>{
        console.error(err),
        console.log("there is issue while making database connection"),
        process.exit(1)
    })
        
}

module.exports = connectToDB

