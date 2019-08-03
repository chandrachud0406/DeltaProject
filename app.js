var express = require('express');
var session = require('express-session');
var connectFlash = require('connect-flash');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var loginRoutes = require('./routes/loginRoutes');
var teacherDashboardRoutes = require('./routes/teacherDashboardRoutes');
var studentDashboardRoutes = require('./routes/studentDashboardRoutes');
var multer = require('multer')

var app = express();
var hour = 3600000000;

//set up public directory
app.use(express.static(__dirname + '/public'));

//set up a session
app.use(session({
    secret: 'random-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 
    },
    store:new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60
    })
}));

//To use fetch post requests
app.use(express.json());

//For Flash messaging
app.use(connectFlash());

//set up the view engine
app.set('view engine', 'ejs');

//set up the multer for image uploads
var storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
        path.extname(file.originalname));
    }
});

var upload = multer({ 
    storage: storage ,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).array('myFiles', 4);

function checkFileType(file, cb){
    //check mime type

    var mimeType = file.mimetype;
    if( (mimeType == 'image/jpeg') || (mimeType == 'image/jpg') || (mimeType == 'image/png') || (mimeType == 'image/gif') ){
        return cb(null, true);
    } else {
        cb('Error: Images Only');
    }

}

//Route controller
loginRoutes(app);
teacherDashboardRoutes(app);
studentDashboardRoutes(app);


//listening to 3000
app.listen(3000);
console.log('listening on 3000');