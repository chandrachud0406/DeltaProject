var mongoose = require('mongoose');
var tests = require('./tests');

var studentSchema = new mongoose.Schema({
    username: String,
    password: String,
    dateOfBirth: Date,
    email: String,
    college: String,
    profilePicture: String,
    attemptedTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tests"
    }],
    rating: [{
        value: Number,
        testNo: Number,
    }],
    currentRating: {
        type: Number,
        default: 1200
    }

});

module.exports = mongoose.model('student', studentSchema);