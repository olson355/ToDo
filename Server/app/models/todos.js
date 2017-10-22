var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

priorities = ['Low', 'Medium', 'High', 'Critical'];

var ToDoSchema = new Schema({
user: { type: Schema.Types.ObjectId, required: true},
todo: { type:String, required: true},
description: { type: String },
dateCreated: { type: Date, default:Date.now },
dateDue: { type: Date, default:Date.now},
completed: {type: Boolean, default: false},
priority: {type: String, enum: priorities},
file: {filrName: String, originalName: String},

})


module.exports = 
Mongoose.model('ToDo', ToDoSchema);