var express = require('express');
var morgan = require('morgan');
var logger = require('./logger');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var glob = require('glob');
var cors = require('cors');




module.exports = function (app, config) {

  //cors
  app.use(cors({origin: 'http://localhost:9000'}));
  

  app.use(function (req, res, next) {
    console.log('Request from ' + req.connection.remoteAddress);
    next();
  });

  //mongoose


  logger.log("Loading Mongoose functionality");
  mongoose.Promise = require('bluebird');
  mongoose.connect(config.db, { useMongoClient: true });
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });



  mongoose.set('debug', true);
  mongoose.connection.once('open', function callback() {
    logger.log("Mongoose connected to the database");
  });
  //morgan
  app.use(morgan('dev'));

  //glob
  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });

  //bodyParser
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app, config);
  });



  app.use(express.static(config.root + '/public'));

  app.use(function (req, res) {
    res.type('text/plan');
    res.status(404);
    res.send('404 Not Found');
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plan');
    res.status(500);
    res.send('500 Sever Error');
  });

  console.log("Starting application");

};

