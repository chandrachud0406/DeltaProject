var mongoose = require('mongoose');
var tests = require('./tests');

var studentSchema = new mongoose.Schema({
    username: String,
    password: String,
    attemptedTests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"tests"
    }]

});

module.exports = mongoose.model('student', studentSchema);