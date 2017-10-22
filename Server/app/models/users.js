var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema({
    firstName: { type: String, required:true},
    lastName: { type: String, required:true},
    status: { type: Boolean, default: true},
    email: { type: String, required: true, Unique: true},
    password: { type: String, required: true},
    dateRegistered: { type: Date, default: true, today: true}
});

module.exports = 
 Mongoose.model('User', userSchema);

