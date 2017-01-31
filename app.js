var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var csurf = require('csurf');
var multer = require('multer');
var upload = multer();
var url= require('url');
var fs= require('fs'); 

var http = require('http');
var https = require('https');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
})
app.use(morgan('combined', {
    stream: accessLogStream
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

//app.use('/graphmarks',express.static(path.join(__dirname, 'public')));

//app.get('graphmarks/index.html', function(req,res){
//  res.status = 200;
//  res.render('index'); 
//})
//app.get('graphmarks/vis.html', function(req,res){
//  res.status = 200;
//  res.render('vis'); 
//})

app.use('/graphmarks',express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){ res.render('index')})
app.get('/index.html', function(req,res){
  res.send('moo')
})
app.get('/vis', function(req,res){
  res.status = 200;
  res.render('vis');
})


//app.use('/graphmarks', routes); // renders index to / request
app.use('/graphmarks/users', users);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (process.env.NODE_ENV !== 'test') {
    app.use(csurf());
    app.use(function(request, response, next) {
        response.locals.csrftoken = request.csrfToken();
        next();
    });
}
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = {
    app: app,
    server: server
};
