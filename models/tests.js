var mongoose = require('mongoose');
var questions = require('./questions');

var testSchema = new mongoose.Schema({
    topic: String,
    totalq: {type: Number,default: 1},
    duration:String,
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"questions"
    }]
});

module.exports = mongoose.model('tests', testSchema);