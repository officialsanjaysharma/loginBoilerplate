var mongoose = require('mongoose');
var MONGO_PATH = "localhost";
var MONGODB_DATABASE = "application";
var MONGO_USER = "";
var MONGO_PASSWORD = "";

const connectToTheDatabase = () => {
  console.log("Connecting to mongo...")
  mongoose.connect(`mongodb://${MONGO_PATH}/${MONGODB_DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // Uncomment this if you have user and password in mongodb
    // auth: {
    //   user: MONGO_USER || '',
    //   password: MONGO_PASSWORD || ''
    // }
  }).then(res => {
    console.log("Connected To Db");
  }).catch(err => {
    console.log('Error connecting: ', err.message)
    console.log("Retrying in 30 seconds")
    setTimeout(() => {
      connectToTheDatabase()
    }, 30000)
  })
}
require("../model/user");
module.exports = connectToTheDatabase;