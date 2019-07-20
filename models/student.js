var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    username: String,
    password: String

});

module.exports = mongoose.model('student', studentSchema);