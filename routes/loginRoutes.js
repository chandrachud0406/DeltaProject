var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var connectFlash = require('connect-flash');

var saltRounds = 10;

//Connect to database
mongoose.connect('mongodb://localhost/examsapp',
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//body parser
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

//importing schemas
var Student = require('../models/student');
var Teacher = require('../models/teacher');


module.exports = function (app) {

    //Flash messages
    app.use(connectFlash());

    //Home page
    app.get('/', function (req, res) {
        res.render('home');
    });

    //Student Signup page
    app.get('/student/signup', function (req, res) {
        var availUsernames = [];
        Student.find({}).exec().then(function (usernames) {

            for (var i = 0; i < usernames.length; i++) {
                availUsernames.push(usernames[i].username);
            }
            res.render('studentSignup', { message: req.flash('info'), users: availUsernames });

        }).catch(function (err) {
            console.log(err);
        });

    });

    //Student Login page
    app.get('/student/login', function (req, res) {
        console.log(req.flash('info'));
        res.render('studentLogin', { message: req.flash('info') });
    });

    //to Create a new student with hashed password
    app.post('/student/signup', urlEncodedParser, function (req, res) {
        //console.log(req.body);

        Student.findOne({ username: req.body.username }).exec().then(function (usercheck) {

            if (usercheck === null) {
                var userPassword = req.body.password;
                bcrypt
                    .genSalt(saltRounds)
                    .then(salt => {
                        //console.log(`Salt: ${salt}`);

                        return bcrypt.hash(userPassword, salt);
                    })
                    .then(hash => {
                        //console.log(`Hash: ${hash}`);
                        req.session.redirectTo = '';
                        //console.log(req.session);
                        var newUser = new Student({ username: req.body.username, password: hash });
                        newUser.rating.push({value:1200, testNo: 0});
                        console.log(newUser);
                        newUser.save(function (err) {
                            if (err) throw err;
                        });
                    })
                    .catch(err => console.error(err.message));
                //createCustomTemplate(newUser._id);
                res.redirect('/student/login');
            }
            else {
                req.flash('info', 'username already exists');
                res.redirect('/student/signup');
            }
        });
    });


    //Login verification for student
    app.post('/student/login', urlEncodedParser, function (req, res) {
        //  console.log(req.body);
        var loginUsername = req.body.username;
        var loginPassword = req.body.password;
        Student.findOne({ username: loginUsername }).exec().then(function (user) {

            if (user !== null) {
                bcrypt
                    .compare(loginPassword, user.password)
                    .then(bool => {
                        if (bool) {
                            var sess = req.session;
                            sess.user = user;
                            var redirectTo = req.session.redirectTo || '';
                            delete req.session.redirectTo;

                            //console.log(req.session);

                            if (redirectTo === '')
                                res.redirect('/student/dashboard');

                            else
                                res.redirect(redirectTo)
                        }
                        else {
                            req.flash('info', 'Incorrect password');
                            res.redirect('/student/login');
                        }
                    })
                    .catch(err => console.error(err.message));
            }

            else {
                req.flash('info', "Username doesn't exist. Create new account here");
                res.redirect('/student/signup');
            }
        });

    });

    //Teacher Signup page
    app.get('/teacher/signup', function (req, res) {
        var availUsernames = [];
        Teacher.find({}).exec().then(function (usernames) {

            for (var i = 0; i < usernames.length; i++) {
                availUsernames.push(usernames[i].username);
            }
            res.render('teacherSignup', { message: req.flash('info'), users: availUsernames });

        }).catch(function (err) {
            console.log(err);
        });

    });

    //Teacher Login page
    app.get('/teacher/login', function (req, res) {
        res.render('teacherLogin', { message: req.flash('info') });
    });

    //to Create a new student with hashed password
    app.post('/teacher/signup', urlEncodedParser, function (req, res) {
        //console.log(req.body);

        Teacher.findOne({ username: req.body.username }).exec().then(function (usercheck) {

            if (usercheck === null) {
                var userPassword = req.body.password;
                bcrypt
                    .genSalt(saltRounds)
                    .then(salt => {
                        //console.log(`Salt: ${salt}`);

                        return bcrypt.hash(userPassword, salt);
                    })
                    .then(hash => {
                        //console.log(`Hash: ${hash}`);
                        req.session.redirectTo = '';
                        //console.log(req.session);
                        var newUser = new Teacher({ username: req.body.username, password: hash });
                        newUser.save(function (err) {
                            if (err) throw err;
                        });
                    })
                    .catch(err => console.error(err.message));
                //createCustomTemplate(newUser._id);
                res.redirect('/teacher/login');
            }
            else {
                req.flash('info', 'username already exists');
                res.redirect('/teacher/signup');
            }
        });
    });


    //Login verification for teacher
    app.post('/teacher/login', urlEncodedParser, function (req, res) {
        //  console.log(req.body);
        var loginUsername = req.body.username;
        var loginPassword = req.body.password;
        Teacher.findOne({ username: loginUsername }).exec().then(function (user) {

            if (user !== null) {
                bcrypt
                    .compare(loginPassword, user.password)
                    .then(bool => {
                        if (bool) {
                            var sess = req.session;
                            sess.user = user;

                            req.session.save(function (err) {
                                console.log(err);
                            })

                            console.log(req.session);

                            res.redirect('/teacher/dashboard');
                        }
                        else {
                            req.flash('info', 'Incorrect password');
                            res.redirect('/teacher/login');
                        }
                    })
                    .catch(err => console.error(err.message));
            }

            else {
                req.flash('info', "Username doesn't exist. Create new account here");
                res.redirect('/teacher/signup');
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.redirect("/");
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