var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var path = require('path');

//body parser
var urlEncodedParser = bodyParser.urlencoded({ extended: false });


var storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
}).array('myFiles', 4);

//importing schemas
var Student = require('../models/student');
var Teacher = require('../models/teacher');
var Test = require('../models/tests');
var Ques = require('../models/questions');

module.exports = function (app) {

    app.get('/student/dashboard', urlEncodedParser, async function (req, res) {
        //console.log(req.session);
        try {
            var currentStud = await Student.findOne({ username: req.session.user.username });
            //console.log(currentStud);

            res.render('studentDashboard', { user: currentStud });
        } catch (err) {
            console.log(err);
        }
    });

    app.get('/teacher/dashboard', urlEncodedParser, async function (req, res) {
        //console.log(req.session);
        try {
            var currentUser = await Teacher.findOne({ username: req.session.user.username });

            res.render('teacherDashboard', { user: currentUser });
        } catch (err) {
            console.log(err);
        }
    });

    app.get('/teacher/tests', urlEncodedParser, async function (req, res) {
        try {
            console.log(req.session);
            var currentUser = await Teacher.findById(req.session.user._id).populate("allTests");
            console.log(currentUser);
            res.render('teacherTests', { user: currentUser });
        }
        catch (err) {
            console.log(err);
        }
    });

    app.get('/test/create', urlEncodedParser, async function (req, res) {
        try {
            console.log(req.session);

            var userID = req.session.user._id;
            var currentUser = await Teacher.findById(userID).populate("tests");
            var newTest = await Test.create({ topic: 'test topic' });

            currentUser.allTests.push(newTest);

            var currentUser = await currentUser.save();
            //console.log(currentUser);

            res.redirect(`/test/${newTest._id}/edit`)

        } catch (err) {
            console.log(err);
        }
    });

    app.get('/test/:tid/edit', urlEncodedParser, async function (req, res) {
        try {
            console.log('created test');
            //var userID = req.session.user._id;
            //var currentUser = await Teacher.findById(userID).populate("tests");
            //console.log(req.params.tid);
            var currentTest = await Test.findById(req.params.tid).populate("questions");
            res.render('teacherTestEdit', { test: currentTest });

        } catch (error) {
            console.log(error);
        }
    });

    app.get('/test/:tid/question/create', urlEncodedParser, async function (req, res) {
        try {
            console.log('question created');
            var currentTest = await Test.findById(req.params.tid);
            var newQues = await Ques.create({ question: 'New question', position: currentTest.totalq });
            currentTest.totalq += 1;

            currentTest.questions.push(newQues);

            var currentTest = await currentTest.save();
            //console.log(currentTest);

            res.send(newQues);
        } catch (error) {
            console.log(error);
        }
    });

    app.get('/question/:qid/edit', urlEncodedParser, async function (req, res) {
        try {
            console.log('navigated to question');
            var currentQues = await Ques.findById(req.params.qid);

            console.log(currentQues);
            res.send(currentQues);

        } catch (error) {
            console.log(error);
        }
    });

    app.post('/question/:qid/edit/save', async function (req, res) {
        try {
            console.log('saved question');
            var currentQues = await Ques.findById(req.params.qid);

            //console.log(req.files);
            //console.log(req.body);
            //console.log((req.body).get('images'));
            //var formData = new FormData(req.body);
            //console.log(currentQues);
            //console.log(formData.getAll('images'));

            upload(req, res, function (err) {
                if (err) {
                    console.log(err);
                }

                console.log(req.files);
                console.log(req.body);

                req.body = JSON.parse(req.body.ques);
                console.log(req.body)
                currentQues.question = req.body.text;
                currentQues.type = req.body.type;

                console.log(req.body.type);

                if (req.body.type == '0' || req.body.type == '1') {
                    currentQues.options[0] = req.body.op1;
                    currentQues.options[1] = req.body.op2;
                    currentQues.options[2] = req.body.op3;
                    currentQues.options[3] = req.body.op4;
                }

                if (req.body.type == '3' || req.body.type == '4') {
                    //console.log((req.files[0].path).slice(6));
                    currentQues.files[0] = (req.files[0].path).slice(6);
                    currentQues.files[1] = (req.files[1].path).slice(6);
                    currentQues.files[2] = (req.files[2].path).slice(6);
                    currentQues.files[3] = (req.files[3].path).slice(6);
                }
                currentQues.markModified('options');
                currentQues.markModified('files');
                currentQues.save().then(function (user) {
                    //console.log(user);
                });

                console.log(currentQues);
                res.send(currentQues);
            });

        } catch (error) {
            console.log(error);
        }
    });

    app.post('/test/:tid/save/details', urlEncodedParser, async function (req, res) {
        try {

            var currentTest = await Test.findById(req.params.tid);
            currentTest.topic = req.body['test-topic'];
            currentTest.marksPerCA = req.body['test-ca'];
            currentTest.marksPerWA = req.body['test-wa'];
            currentTest.duration = req.body['test-duration'];

            currentTest = await currentTest.save();
            console.log(currentTest);
            res.redirect(`/test/${req.params.tid}/edit`);

        } catch (error) {
            console.log(error);
        }

    });


    //Middleware to check whether the user has logged in
    function isLoggedIn(req, res, next) {
        if (req.session.user && req.session.user != "")
            next();
        else {
            console.log('error no login');
            res.redirect('/');
        }
    }
}