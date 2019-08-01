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

var lastClickedID;
module.exports = function (app) {

    app.get('/student/dashboard', urlEncodedParser, async function (req, res) {
        ////console.log(req.session);
        try {
            var currentStud = await Student.findOne({ username: req.session.user.username });
            ////console.log(currentStud);

            res.render('studentDashboard', { user: currentStud });
        } catch (err) {
            //console.log(err);
        }
    });


    app.get('/view/student/profile/:uid', async function (req, res) {
        try {
            var currentStud = await Student.findById(req.params.uid);

            res.render('myProfile', { user: currentStud });

        } catch (error) {

        }
    });

    app.get('/view/student/profile/guest/:uid', async function(req, res){
        try {
            var currentStud  = await Student.findById(req.params.uid);

            res.render( 'viewProfile' ,{ user: currentStud});
            
        } catch (error) {
            
        }
    });

    app.post('/edit/student/profile/:uid', async function (req, res) {
        try {
            console.log(req.params.uid);
            console.log(req.body);
            var currentStud = await Student.findById(req.params.uid);

            console.log(currentStud);
            currentStud.email = req.body.email;
            currentStud.dateOfBirth = req.body.dob;
            currentStud.college = req.body.college;

            currentStud = await currentStud.save();

            res.send(currentStud);

        } catch (error) {
            console.log(error);
        }
    });

    app.get('/student/:uid/rating', async function (req, res) {
        try {
            console.log(req.params.uid);
            var currentStud = await Student.findById(req.params.uid);
            var ratings = currentStud.rating


            var data = [];
            var labels = [];
            for (var i = 0; i < currentStud.rating.length; i++) {
                data.push(currentStud.rating[i].value);
                labels.push(currentStud.rating[i].testNo);
            }

            res.send(ratings);
        } catch (error) {

        }
    });
    app.get('/student/tests', urlEncodedParser, async function (req, res) {
        try {
            ////console.log(req.session);
            var allTests = await Test.find({}).populate('questions');

            var currentStud = await Student.findById(req.session.user._id).populate('attemptedTests');
            var doneTests = currentStud.attemptedTests;

            var newTests = [];
            for (var i = 0; i < doneTests.length; i++) {
                for (var j = 0; j < allTests.length; j++) {
                    if (JSON.stringify(doneTests[i]._id) !== JSON.stringify(allTests[j]._id)) {
                        newTests.push(allTests[i]);
                    }
                }
            }

            if (doneTests.length == 0) {
                res.render('studentTests', { tests: allTests, attTests: [] });
            } else {
                res.render('studentTests', { tests: newTests, attTests: doneTests });
            }
        }
        catch (err) {
            //console.log(err);
        }
    });



    // app.get('/test/create', urlEncodedParser, async function (req, res) {
    //     try {
    //         ////console.log(req.session);

    //         var userID = req.session.user._id;
    //         var currentUser = await Teacher.findById(userID).populate("tests");
    //         var newTest = await Test.create({ topic: 'test topic' });

    //         currentUser.allTests.push(newTest);

    //         var currentUser = await currentUser.save();
    //         ////console.log(currentUser);

    //         res.redirect(`/test/${newTest._id}/edit`)

    //     } catch (err) {
    //         //console.log(err);
    //     }
    // });

    app.get('/test/:tid/view', urlEncodedParser, async function (req, res) {
        try {
            lastClickedID = null;
            //console.log('view test');
            //var userID = req.session.user._id;
            //var currentUser = await Teacher.findById(userID).populate("tests");
            ////console.log(req.params.tid);
            var currentTest = await Test.findById(req.params.tid).populate("questions");
            var currentStud = await Student.findById(req.session.user._id);
            currentStud.attemptedTests.push(currentTest._id);
            // var filledUsers = [];

            // for (var i = 0; i < currentTest.attemptedUsers.length; i++) {
            //     filledUsers.push(currentTest.attemptedUsers.user.username);
            // }

            //            if (!currentTest.attemptedUsers.includes(req.session.user.username)) {
            //        currentTest.attemptedUsers.push({ user: req.session.user._id, marks: 0 });

            //      currentTest.markModified('attemptedUsers');

            //    currentTest = await currentTest.save();

            currentStud.markModified('attemptedTests');

            currentStud = await currentStud.save();
            console.log(currentStud);
            res.render('studentTestView', { test: currentTest });

            //          } else {
            //          res.redirect(`/test/${currentTest._id}/view/analytics`);
            //        }

        } catch (error) {
            //console.log(error);
        }
    });

    function timeToSeconds(timeArray) {
        var hours = timeArray[0] * 1;
        var minutes = (timeArray[1] * 1);
        var seconds = (hours * 3600) + (minutes * 60) + (timeArray[2] * 1);
        return seconds;
    }

    app.get('/question/:qid/view/:time', async function (req, res) {
        try {
            //console.log('navigated to question');

            var currentTime = req.params.time;

            if (currentTime.length == 5) {
                currentTime += ':00';
                ////console.log(currentTime);    
            }

            var currentQues = await Ques.findById(req.params.qid);
            var currentUserID = req.session.user._id;
            var currentAns = await Ans.findOne({ user: currentUserID, parentQn: req.params.qid });

            if (currentAns == null) {
                currentAns = await Ans.create({ user: req.session.user._id, parentQn: req.params.qid });
                currentQues.answers.push(currentAns._id);
            }

            // //console.log(`$$$$$${lastClickedID}`);
            if (lastClickedID !== null) {
                var lastAns = await Ans.findById(lastClickedID);
                var timeString = currentTime;
                var timeString1 = lastAns.startTime;
                var timeArray1 = timeString1.split(':');
                var timeArray = timeString.split(':');

                ////console.log(timeToSeconds(timeArray1) - timeToSeconds(timeArray));

                lastAns.timeSpent += (timeToSeconds(timeArray1) - timeToSeconds(timeArray));
                lastAns = await lastAns.save();
                ////console.log(lastAns);
            }

            currentAns.color = 'rgb(237, 96, 96)';
            currentAns.startTime = currentTime;
            lastClickedID = currentAns._id;

            var currentQues = await currentQues.save();
            var currentAns = await currentAns.save();
            ////console.log(currentQues);
            //console.log(currentAns);
            res.send({ qns: currentQues, ans: currentAns });

        } catch (error) {
            //console.log(error);
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
            //console.log('saved answer');
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
            } else if (arraysEqual(currentAns.answerContent, [false, false, false, false])) {
                currentAns.status = 0;
            } else {
                currentAns.status = -1;
            }

            currentAns.color = 'rgb(41, 185, 153)';
            currentQues.markModified('answers');
            currentAns.markModified('answerContent');

            ////console.log(currentAns);
            currentQues.save().then(function (user) {
                currentAns.save().then(function (user) {
                    ////console.log(user);
                });
            });

            ////console.log(currentAns);
            ////console.log(currentQues);
            res.send(currentAns);

        } catch (error) {
            //console.log(error);
        }
    });

    app.post('/question/:qid/view/review', async function (req, res) {
        try {
            //console.log('saved answer and marked for review');
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
            } else if (arraysEqual(currentAns.answerContent, [false, false, false, false])) {
                currentAns.status = 0;
            } else {
                currentAns.status = -1;
            }

            currentAns.color = 'rgb(86, 95, 184)';
            currentQues.markModified('answers');
            currentAns.markModified('answerContent');

            ////console.log(currentAns);
            currentQues.save().then(function (user) {
                currentAns.save().then(function (user) {
                    ////console.log(user);
                });
            });

            ////console.log(currentAns);
            ////console.log(currentQues);
            res.send(currentAns);

        } catch (error) {
            //console.log(error);
        }
    });

    app.post('/question/:qid/view/clear', async function (req, res) {
        try {
            //console.log('cleared selection');
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
            } else if (arraysEqual(currentAns.answerContent, [false, false, false, false])) {
                currentAns.status = 0;
            } else {
                currentAns.status = -1;
            }

            currentAns.color = 'rgb(237, 96, 96)';
            currentQues.markModified('answers');
            currentAns.markModified('answerContent');

            ////console.log(currentAns);
            currentQues.save().then(function (user) {
                currentAns.save().then(function (user) {
                    ////console.log(user);
                });
            });

            ////console.log(currentAns);
            ////console.log(currentQues);
            res.send(currentAns);

        } catch (error) {
            //console.log(error);
        }
    });

    app.get('/test/:tid/view/results/:time', urlEncodedParser, async function (req, res) {
        try {
            var currentStud = await Student.findById(req.session.user._id);
            var currentTest = await Test.findById(req.params.tid).populate("questions");

            var total = 0;
            var colorCount = [0, 0, 0, 0];
            var currentAnswer = [];
            if (lastClickedID !== null) {
                var lastAns = await Ans.findById(lastClickedID);
                var timeString = req.params.time;
                var timeString1 = lastAns.startTime;
                var timeArray1 = timeString1.split(':');
                var timeArray = timeString.split(':');
                //console.log(timeToSeconds(timeArray1) - timeToSeconds(timeArray));

                lastAns.timeSpent += (timeToSeconds(timeArray1) - timeToSeconds(timeArray));
                lastAns = await lastAns.save();
                //console.log(lastAns);
            }
            for (var i = 0; i < currentTest.questions.length; i++) {
                var currentAns = Ans.findOne({ user: currentStud._id, parentQn: currentTest.questions[i]._id });
                currentAnswer.push(currentAns);
            }

            currentAnswer = await Promise.all(currentAnswer);
            console.log(currentAnswer);

            var totalMarks = 0;
            for (var i = 0; i < currentAnswer.length; i++) {
                totalMarks += currentTest.questions[i].marksPerCA;
                if (currentAnswer[i] !== null) {
                    ////console.log(currentAns);
                    if (currentAnswer[i].status == 1) {
                        total += currentTest.questions[i].marksPerCA;
                    } else if (currentAnswer[i].status == -1) {
                        total += currentTest.questions[i].marksPerWA;
                    }

                    if (currentAnswer[i].color == 'rgb(41, 185, 153)') {
                        colorCount[0] += 1;
                    }
                    else if (currentAnswer[i].color == 'rgb(237, 96, 96)') {
                        colorCount[1] += 1;
                    }
                    else if (currentAnswer[i].color == 'rgb(86, 95, 184)') {
                        colorCount[2] += 1;
                    }
                } else if (currentAnswer[i] == null) {
                    colorCount[3] += 1;
                }
            }

            var score = (total / totalMarks) * 100;
            score = Math.ceil(score);

            if (score <= 100 && score > 75) {
                var x = currentStud.currentRating;
                currentStud.currentRating += 100;
                currentStud.rating.push({ value: (x + 100), testNo: currentStud.attemptedTests.length });
            } else if (score <= 75 && score > 50) {
                var x = currentStud.currentRating;
                currentStud.currentRating += 50;
                currentStud.rating.push({ value: (x + 50), testNo: currentStud.attemptedTests.length });

            } else if (score <= 50 && score > 25) {
                var x = currentStud.currentRating;
                currentStud.currentRating += 0;
                currentStud.rating.push({ value: (x), testNo: currentStud.attemptedTests.length });

            } else if (score <= 25 && score > 0) {
                var x = currentStud.currentRating;
                currentStud.currentRating -= 50;
                currentStud.rating.push({ value: (x - 50), testNo: currentStud.attemptedTests.length });

            } else if (score <= 0) {
                var x = currentStud.currentRating;
                currentStud.currentRating -= 100;
                currentStud.rating.push({ value: (x - 100), testNo: currentStud.attemptedTests.length });
            }

            currentStud = await currentStud.save();
            console.log(currentStud);

            currentTest.attemptedUsers.push({ user: currentStud._id, marks: score });

            currentTest.markModified('attemptedUsers');
            currentTest = await currentTest.save();

            res.render('studentTestResult', { test: currentTest, total: total, colorCount: colorCount });

        } catch (error) {
            console.log(error);
        }
    });

    function nameOptions(type, optionsArray) {

        var optionsText = ['A', 'B', 'C', 'D'];
        var answerOptions = [];

        if (type !== 2) {
            for (var i = 0; i < 4; i++) {
                if (optionsArray[i]) {
                    answerOptions.push(optionsText[i]);
                }
            }
        } else if (type == 2) {
            answerOptions.push(optionsArray[0]);
        }

        return answerOptions;
    }

    app.get('/test/:tid/view/analytics', async function (req, res) {
        try {
            var currentStud = await Student.findById(req.session.user._id);
            var currentTest = await Test.findById(req.params.tid).populate("questions");

            var attUsers = currentTest.attemptedUsers.populate("user");
            console.log(`$$$$$${attUsers}`);
            var answerArray = [];
            var statusArray = [0, 0, 0];
            var currentAnswer = [];
            var total = 0;

            attUsers.sort((a, b) => (a.marks > b.marks) ? 1 : -1);
            console.log(attUsers);
            for (var i = 0; i < currentTest.questions.length; i++) {
                var currentAns = Ans.findOne({ user: currentStud._id, parentQn: currentTest.questions[i]._id });

                if (currentAns !== null) {
                    currentAnswer.push(currentAns);
                }
            }
            var totalMarks = 0;
            currentAnswer = await Promise.all(currentAnswer);
            for (var i = 0; i < currentTest.questions.length; i++) {
                totalMarks += currentTest.questions[i].marksPerCA;

                if (currentAnswer[i] !== null) {
                    var answerObj = {
                        qno: (i + 1),
                        rightAnswer: nameOptions(currentTest.questions[i].type, currentTest.questions[i].correctAnswers),
                        yourAnswer: nameOptions(currentTest.questions[i].type, currentAnswer[i].answerContent),
                        status: currentAnswer[i].status,
                        marksAwarded: 0,
                        maxMarks: currentTest.questions[i].marksPerCA
                    };
                    if (currentAnswer[i].status == 1) {
                        total += currentTest.questions[i].marksPerCA;
                        answerObj.marksAwarded = currentTest.questions[i].marksPerCA;
                        statusArray[0] += 1;
                    } else if (currentAnswer[i].status == -1) {
                        total += currentTest.questions[i].marksPerWA;
                        answerObj.marksAwarded = currentTest.questions[i].marksPerWA;
                        statusArray[1] += 1;
                    }

                } else if (currentAnswer[i] == null) {
                    var answerObj = {
                        qno: (i + 1),
                        rightAnswer: nameOptions(currentTest.questions[i].type, currentTest.questions[i].correctAnswers),
                        yourAnswer: nameOptions(currentTest.questions[i].type, [false, false, false, false]),
                        status: 0,
                        marksAwarded: 0,
                        maxMarks: currentTest.questions[i].marksPerCA
                    };
                }
                answerArray.push(answerObj);
            }

            //console.log(statusArray);
            res.render('studentTestAnalytics', { answerArray: answerArray, total: total, totalMarks: totalMarks, attUsers: attUsers });
        } catch (error) {
            //console.log(error);
        }
    });

    app.get('/test/:tid/view/analytics/data', urlEncodedParser, async function (req, res) {
        try {
            var currentStud = await Student.findById(req.session.user._id);
            var currentTest = await Test.findById(req.params.tid).populate("questions");

            var currentAnswer = [];
            var statusArray = [0, 0, 0];
            var timeSpentArray = [0, 0, 0];
            var total = 0;
            var totalMarks = 0;

            for (var i = 0; i < currentTest.questions.length; i++) {
                var currentAns = Ans.findOne({ user: currentStud._id, parentQn: currentTest.questions[i]._id });

                if (currentAns !== null) {
                    currentAnswer.push(currentAns);
                }
            }

            currentAnswer = await Promise.all(currentAnswer);
            for (var i = 0; i < currentTest.questions.length; i++) {
                totalMarks += currentTest.questions[i].marksPerCA;

                if (currentAnswer[i] !== null) {
                    if (currentAnswer[i].status == 1) {
                        total += currentTest.questions[i].marksPerCA;
                        statusArray[0] += 1;
                        timeSpentArray[0] += currentAnswer[i].timeSpent;
                    } else if (currentAnswer[i].status == -1) {
                        total += currentTest.questions[i].marksPerWA;
                        statusArray[1] += 1;
                        timeSpentArray[1] += currentAnswer[i].timeSpent;
                    } else if (currentAnswer[i].status == 0) {
                        statusArray[2] += 1;
                        timeSpentArray[2] += currentAnswer[i].timeSpent;
                    }
                } else if (currentAnswer[i] == null) {
                    statusArray[2] += 1;
                }
            }

            // for (var i = 0; i < currentTest.questions.length; i++) {
            //     var currentAns = await Ans.findOne({ user: currentStud._id, parentQn: currentTest.questions[i]._id });

            //     if (currentAns !== null) {
            //         if (currentAns.status == 1) {
            //             total += currentTest.questions[i].marksPerCA;
            //             statusArray[0] += 1;
            //             timeSpentArray[0] += currentAns.timeSpent;
            //         } else if (currentAns.status == -1) {
            //             total += currentTest.questions[i].marksPerWA;
            //             statusArray[1] += 1;
            //             timeSpentArray[1] += currentAns.timeSpent
            //         } else if (currentAns.status == 0) {
            //             statusArray[2] += 1;
            //             timeSpentArray[2] += currentAns.timeSpent
            //         }


            //     }
            // }

            var score = (total / totalMarks) * 100;
            //console.log(statusArray, score);
            res.send({ timeSpentArray: timeSpentArray, statusArray: statusArray, score: score, total: total });
        } catch (error) {
            //console.log(error);
        }
    })

    app.post('/test/:tid/save/details', urlEncodedParser, async function (req, res) {
        try {

            var currentTest = await Test.findById(req.params.tid);
            currentTest.topic = req.body['test-topic'];
            currentTest.duration = req.body['test-duration'];

            currentTest = await currentTest.save();
            ////console.log(currentTest);
            res.redirect(`/test/${req.params.tid}/edit`);

        } catch (error) {
            //console.log(error);
        }

    });


    //Middleware to check whether the user has logged in
    function isLoggedIn(req, res, next) {
        if (req.session.user && req.session.user != "")
            next();
        else {
            //console.log('error no login');
            res.redirect('/');
        }
    }
}