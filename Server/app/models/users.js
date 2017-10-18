var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema({
    firstName: { type: String, required:true},
    lastName: { type: String, required:true}
});

module.exports = 
 Mongoose.model('MyModel', mySchema);

