//express file

//requires express
var express = require('express');

//lists request from
module.exports = function (app, config) {
    
      app.use(function (req, res, next) {
        console.log('Request from ' + req.connection.remoteAddress);
        next();
      });

      app.use(express.static(config.root + '/public'));
      
      //error handling 
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
      