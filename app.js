var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
let AuthRouter = require('./auth/AuthController');
app.use('/users', UserController);

app.use('/api/auth', AuthRouter);

module.exports = app;