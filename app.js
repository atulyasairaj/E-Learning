var db = require('./config/db');
db.mongoConnect();
var mongoose = require('mongoose');

//Define All schemas
var user = require('./models/users.js'),
    course = require('./models/course.js'),
    exam = require('./models/exam.js'),
    answered = require('./models/answered.js'),
    enroll = require('./models/enroll.js')
    score = require('./models/score.js'),
    feedback = require('./models/feedback.js'),
    admin = require('./models/admin.js');

//Other Required Files
var Token = require('./config/token');
var auth = require('./config/authenticate');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//Extra modules
var passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('put-a-$Ecr3t-h3re'));
app.use(session({secret:'@#$dkjfoue343!',resave: true,
    saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use(isLoggedIn);

//Browserify
var browserify = require('browserify-middleware');
app.get('/javascripts', browserify('./public/javascripts'));
app.get('/template', browserify('./public/template'));

var routes = require('./routes/index');
var trainer = require('./routes/trainer');
var learner = require('./routes/learner');
var course = require('./routes/course');
var admin = require('./routes/admin');

app.use('/', routes);
app.use('/trainer', auth.authentication, trainer);
app.use('/learner', auth.authentication, learner);
app.use('/course', course);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


function isLoggedIn(req, res, next){

    var token = req.signedCookies.token;
    delete res.locals.isLoggedIn;
    delete res.locals.type;
    if(token){
        Token.validateUserToken(token, function(err, usr){
            if(err){
                res.locals.isLoggedIn = false;
            } else {
                if(usr.trainer){
                    res.locals.isLoggedIn = true;
                    res.locals.type = '/trainer';
                }
                else{
                    res.locals.type = '/learner';
                    res.locals.isLoggedIn = true;
                }
                
            }
        });
    } else {
        res.locals.isLoggedIn = false;
    }
    next();
}

//Socket.io & Binary Server
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var http = require('http').createServer(app);
http.listen(server_port,server_ip_address,function(){
    console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});
var io = require('socket.io').listen(http);

io.set('destroy upgrade', false);
io.set('transports', ['websocket', 'polling']);

var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({port: 8000, path:'/binary-endpoint'});

var socket  = require('./config/socket')(io);
var binary  = require('./config/binaryjs')(bs);

module.exports = app;