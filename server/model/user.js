//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var userModelSchema = new Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: { type: String, unique: true, index: true },

});
const userModel = mongoose.model('User', userModelSchema);
module.exports = userModel;