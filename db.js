const mongoose = require('mongoose');
const mongooseURI = "mongodb+srv://dev064:Adityajha%4011@cluster1.tizixwp.mongodb.net/ktj_test?retryWrites=true&w=majority"
const startdb=()=>{
    mongoose.connect(mongooseURI)
    mongoose.connection.useDb("admin")
    console.log("Database is connsdected succesfully")
}
module.exports = startdb;