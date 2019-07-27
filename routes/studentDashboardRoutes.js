var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//body parser
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

//importing schemas
var Student = require('../models/student');
var Teacher = require('../models/teacher');
var Test = require('../models/tests');
var Ques = require('../models/questions');
var Ans = require('../models/answers');

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

    app.get('/student/tests', urlEncodedParser, async function (req, res) {
        try {
            //console.log(req.session);
            var allTests = await Test.find({}).populate('questions');
            //            console.log(currentUser);
            res.render('studentTests', { tests: allTests });
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

    app.get('/test/:tid/view', urlEncodedParser, async function (req, res) {
        try {
            console.log('view test');
            //var userID = req.session.user._id;
            //var currentUser = await Teacher.findById(userID).populate("tests");
            //console.log(req.params.tid);
            var currentTest = await Test.findById(req.params.tid).populate("questions");
            res.render('studentTestView', { test: currentTest });

        } catch (error) {
            console.log(error);
        }
    });


    app.get('/question/:qid/view', urlEncodedParser, async function (req, res) {
        try {
            console.log('navigated to question');
            var currentQues = await Ques.findById(req.params.qid);

            var currentUserID = req.session.user._id;
            var currentAns = await Ans.findOne({ user: currentUserID, parentQn: req.params.qid });

            if(currentAns !== null) {
                currentAns.color = 'rgb(237, 96, 96)';
            }

            var currentQues = await currentQues.save();
            console.log(currentQues);
            console.log(currentAns);
            res.send({ qns: currentQues, ans: currentAns });

        } catch (error) {
            console.log(error);
        }
    });
    function arraysEqual(arr1, arr2) {

        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }

        // Otherwise, return true
        return true;

    }

    app.post('/question/:qid/view/save', async function (req, res) {
        try {
            console.log('saved answer');
            var currentQues = await Ques.findById(req.params.qid);

            var currentAns = await Ans.findOne({ user: req.session.user._id, parentQn: req.params.qid });
            if (currentAns == null) {
                currentAns = await Ans.create({ user: req.session.user._id, parentQn: req.params.qid, answerContent: req.body.boolArray });
                currentQues.answers.push(currentAns._id);
            } else {
                currentAns.answerContent = req.body.boolArray;
            }

            if (arraysEqual(currentQues.correctAnswers, currentAns.answerContent)) {
                currentAns.status = 1;
            } else if(arraysEqual(currentAns.answerContent, [false, false, false, false])){
                currentAns.status = 0;
            } else {
                currentAns.status = -1;
            }

            currentAns.color = 'rgb(41, 185, 153)';
            currentQues.markModified('answers');
            currentAns.markModified('answerContent');

            //console.log(currentAns);
            currentQues.save().then(function (user) {
                currentAns.save().then(function (user) {
                    //console.log(user);
                });
            });

            console.log(currentAns);
            console.log(currentQues);
            res.send(currentAns);

        } catch (error) {
            console.log(error);
        }
    });

    app.post('/question/:qid/view/review', async function (req, res) {
        try {
            console.log('saved answer and marked for review');
            var currentQues = await Ques.findById(req.params.qid);
            var currentAns = await Ans.findOne({ user: req.session.user._id, parentQn: req.params.qid });

            if (currentAns == null) {
                currentAns = await Ans.create({ user: req.session.user._id, parentQn: req.params.qid, answerContent: req.body.boolArray });
                currentQues.answers.push(currentAns._id);
            } else {
                currentAns.answerContent = req.body.boolArray;
            }

            if (arraysEqual(currentQues.correctAnswers, currentAns.answerContent)) {
                currentAns.status = 1;
            } else if(arraysEqual(currentAns.answerContent, [false, false, false, false])){
                currentAns.status = 0;
            } else {
                currentAns.status = -1;
            }

            currentAns.color = 'rgb(86, 95, 184)';
            currentQues.markModified('answers');
            currentAns.markModified('answerContent');

            //console.log(currentAns);
            currentQues.save().then(function (user) {
                currentAns.save().then(function (user) {
                    //console.log(user);
                });
            });

            console.log(currentAns);
            console.log(currentQues);
            res.send(currentAns);

        } catch (error) {
            console.log(error);
        }
    });

    app.post('/question/:qid/view/clear', async function (req, res) {
        try {
            console.log('cleared selection');
            var currentQues = await Ques.findById(req.params.qid);
            var currentAns = await Ans.findOne({ user: req.session.user._id, parentQn: req.params.qid });

            if (currentAns == null) {
                currentAns = await Ans.create({ user: req.session.user._id, parentQn: req.params.qid, answerContent: req.body.boolArray });
                currentQues.answers.push(currentAns._id);
            } else {
                currentAns.answerContent = req.body.boolArray;
            }

            if (arraysEqual(currentQues.correctAnswers, currentAns.answerContent)) {
                currentAns.status = 1;
            } else if(arraysEqual(currentAns.answerContent, [false, false, false, false])){
                currentAns.status = 0;
            } else {
                currentAns.status = -1;
            }

            currentAns.color = 'rgb(237, 96, 96)';
            currentQues.markModified('answers');
            currentAns.markModified('answerContent');

            //console.log(currentAns);
            currentQues.save().then(function (user) {
                currentAns.save().then(function (user) {
                    //console.log(user);
                });
            });

            console.log(currentAns);
            console.log(currentQues);
            res.send(currentAns);

        } catch (error) {
            console.log(error);
        }
    });

    app.get('/test/:tid/view/results', urlEncodedParser, async function(req, res){
        try {
            var currentStud = await Student.findById(req.session.user._id);
            var currentTest = await Test.findById(req.params.tid).populate("questions");

            // for(var i = 0; i < currentTest.questions.length; i++) {
            //     console.log(currentTest.questions[i]);
            // }
            var total = 0;
            var colorCount = [0, 0, 0, 0];
            for(var i = 0; i < currentTest.questions.length; i++) {
                var currentAns =  await Ans.findOne({ user: currentStud._id, parentQn: currentTest.questions[i]._id});

                //console.log(currentAns);
                if(currentAns.status == 1) {
                    total += currentTest.questions[i].marksPerCA;
                } else if(currentAns.status == -1){
                    total += currentTest.questions[i].marksPerWA;
                } 

                if(currentAns.color =='rgb(41, 185, 153)' ) {
                    colorCount[0] += 1;
                }
                else if(currentAns.color == 'rgb(237, 96, 96)') {
                    colorCount[1] += 1;                    
                }
                else if(currentAns.color == 'rgb(86, 95, 184)') {
                    colorCount[2] += 1;
                }
                else if(currentAns.color == 'rgb(196, 189, 189)') {
                    colorCount[3] += 1;
                }
            }

            console.log(colorCount);

            res.render('studentTestResult', {total: total, colorCount: colorCount})


        } catch (error) {
            console.log(error);
        }
    });

    app.post('/test/:tid/save/details', urlEncodedParser, async function (req, res) {
        try {

            var currentTest = await Test.findById(req.params.tid);
            currentTest.topic = req.body['test-topic'];
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