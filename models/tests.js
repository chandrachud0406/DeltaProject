var mongoose = require('mongoose');
var questions = require('./questions');
var student = require('./student');

var testSchema = new mongoose.Schema({
    topic: String,
    totalq: { type: Number, default: 1 },
    duration: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions"
    }],
    totalMarks: {
        type: Number,
        default: 0
    },
    attemptedUsers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student"
        },
        marks: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model('tests', testSchema);