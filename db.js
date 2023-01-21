const mongoose = require('mongoose');
const mongooseURI = "mongodb+srv://cluster1.tizixwp.mongodb.net/myFirstDatabase"
const startdb=()=>{
    mongoose.connect(mongooseURI)
    console.log("Database is connsdected succesfully")
}
module.exports = startdb;