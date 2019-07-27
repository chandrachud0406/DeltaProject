var mongoose = require('mongoose');
var student = require('./student');
var questions = require('./questions');
var ansSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student"
    },
    parentQn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"questions"
    },   
    answerContent:{
        type:Array,
        default: [false, false, false, false]
    },
    color:{
        type:String,
        default:'rgb(196, 189, 189)',
    },
    status: {
        type:Number,
        default: 0
    }
});

module.exports = mongoose.model('answers', ansSchema);