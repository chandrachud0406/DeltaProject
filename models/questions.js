var mongoose = require('mongoose');
var answers = require('./answers');

var quesSchema = new mongoose.Schema({
    question: String,
    correctAnswers: {
        type: Array,
        default: [false, false, false, false]
    },
    position: Number,
    options: {
        type: Array,
        default: ['option1', 'option2', 'option3', 'option4']
    },
    marksPerCA: {
        type:Number,
        default: 3
    },
    marksPerWA: {
        type:Number,
        default: -1
    },
    type: {
        type: Number,
        default: -1
    },
    files: {
        type: Array,
        default: ['/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png']
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "answers"
    }]
});

module.exports = mongoose.model('questions', quesSchema);