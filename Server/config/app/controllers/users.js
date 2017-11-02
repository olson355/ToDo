
var express = require('express'),
  router = express.Router(),
  logger = require('../../config/logger');
//import the user model
mongoose = require('mongoose'),
User = mongoose.model('User');


module.exports = function (app, config) {
    app.use('/api', router);
    
    router.route('/users').get(function(req, res, next){
		logger.log('Get all users', 'verbose');

        //GET all users Handler
            var query = User.find()
              .sort(req.query.order)
              .exec()
              .then(result => {
                   if(result && result.length) {
                  res.status(200).json(result);
              } else {
                  res.status(404).json({message: 'No users'});
              }
              })
              .catch(err => {
                return next(err);
              });
          })
      
   
    router.route('/users/userID').get(function(req, res, next){
        logger.log('Get all users', 'verbose');
        //Get a user handler
                User.findById(req.params.userId)
                    .then(user => {
                        if(user){
                            res.status(200).json(user);
                        } else {
                            res.status(404).json({message: "No user found"});
                        }
                    })
                    .catch(error => {
                        return next(error);
                    });
            }); 
        



    router.route('/users').post(function(req, res, next){
		logger.log('Get all users', 'verbose');
         //user POST handler
    var user = new User(req.body);
    user.save()
    .then(result => {
        res.status(201).json(result);
    })
    .catch( err => {
       return next(err);
    });
    });

    router.route('/users').put(function(req, res, next){
		logger.log('Get all users', 'verbose');
        res.status(200).json({message: "Update User"});
    });

    router.route('/users/password/userID').put(function(req, res, next){
		logger.log('Get all users', 'verbose');
        res.status(200).json({message: "Update user password" + rew.params.userID});
    });

    router.route('/users/userID').delete(function(req, res, next){
		logger.log('Get all users', 'verbose');
//Delete Handler
            User.remove({ _id: req.params.userId })
                .then(user => {
                    res.status(200).json({msg: "User Deleted"});
                })
                .catch(error => {
                    return next(error);
                });
        
        //slide 13 Express Routing? Don't know where to put this
    // router.get('/user/:id', function(req, res, next){
    //    logger.log('Get user' + req.params.id, 'verbose');
        
    //      res.status(200).json({id: req.params.id}); 
    //});
        


    });


};
