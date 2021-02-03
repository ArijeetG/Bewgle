var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const responseTime = require('response-time')
var indexRouter = require('./routes/index');

var app = express();

app.use((req,res,next)=>{
  req.start = Date.now()
  next()
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);

app.listen(process.env.PORT || 3000,()=>console.log('Listening'))

//module.exports = app;
