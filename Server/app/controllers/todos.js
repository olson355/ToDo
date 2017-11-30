//I think I have to change all the Users to ToDo?? Maybe?

var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger');
//import the user model
mongoose = require('mongoose'),
    User = mongoose.model('User');
multer = require('multer'),
    mkdirp = require('mkdirp');
passport = require("passport");



module.exports = function (app, config) {
    app.use('/api', router);

    router.route('/User').get(function (req, res, next) {
        logger.log('Get all Users', 'verbose');

        //GET all User Handler
        var query = User.find()
            .sort(req.query.order)
            .exec()
            .then(result => {
                if (result && result.length) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: 'No User' });
                }
            })
            .catch(err => {
                return next(err);
            });
    })


    router.route('/users/userID').get(function (req, res, next) {
        logger.log('Get all users', 'verbose');
        //Get a user handler
        User.findById(req.params.userId)
            .then(user => {
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: "No user found" });
                }
            })
            .catch(error => {
                return next(error);
            });
    });


    router.route('/users').post(function (req, res, next) {
        logger.log('Get all users', 'verbose');
        //user POST handler
        var user = new User(req.body);
        user.save()
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                return next(err);
            });
    });

    router.route('/users').put(function (req, res, next) {
        logger.log('Get all users', 'verbose');
        res.status(200).json({ message: "Update User" });
    });

    router.route('/users/password/userID').put(function (req, res, next) {
        logger.log('Get all users', 'verbose');
        res.status(200).json({ message: "Update user password" + rew.params.userID });
    });

    router.route('/users/userID').delete(function (req, res, next) {
        logger.log('Get all users', 'verbose');
        //Delete Handler
        User.remove({ _id: req.params.userId })
            .then(user => {
                res.status(200).json({ msg: "User Deleted" });
            })
            .catch(error => {
                return next(error);
            });
    });

    //multer and mkdirp
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var path = config.uploads + req.params.userId + "/";
            mkdirp(path, function (err) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    cb(null, path);
                }
            });
        },
        filename: function (req, file, cb) {
            let fileName = file.originalname.split('.');
            cb(null, fileName[0] + new Date().getTime() + "." + fileName[fileName.length - 1]);
        }
    });

    var upload = multer({ storage: storage });


    router.post('/todos/upload/:userId/:todoId', upload.any(), function (req, res, next) {
        logger.log('Upload file for todo ' + req.params.todoId + ' and ' + req.params.userId, 'verbose');

        Todo.findById(req.params.todoId, function (err, todo) {
            if (err) {
                return next(err);
            } else {
                if (req.files) {
                    todo.file = {
                        filename: req.files[0].filename,
                        originalName: req.files[0].originalname,
                        dateUploaded: new Date()
                    };
                }
                todo.save()
                    .then(todo => {
                        res.status(200).json(todo);
                    })
                    .catch(error => {
                        return next(error);
                    });
            }
        });
    });
};
