var mongoose = require('mongoose');
var tests = require('./tests');

var teacherSchema = new mongoose.Schema({
    username: String,
    password: String,
    allTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"tests",
        default:[]
    }]

});

module.exports = mongoose.model('teacher', teacherSchema);