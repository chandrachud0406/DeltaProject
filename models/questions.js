var mongoose = require('mongoose');

var quesSchema = new mongoose.Schema({
    question: String,
    correctAnswers: Array,
    position: Number,
    options: {
        type: Array,
        default: ['option1', 'option2', 'option3', 'option4']
    },
    status: String,
    type: {
        type: Number,
        default: -1
    },
    files: {
        type: Array,
        default: ['/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png', '/styles/images/dummyimage.png']
    }
});

module.exports = mongoose.model('questions', quesSchema);