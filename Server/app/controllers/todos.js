

var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger');
//import the user model
mongoose = require('mongoose'),
    ToDo = mongoose.model('ToDo');
multer = require('multer'),
    mkdirp = require('mkdirp');
passport = require("passport");

var requireAuth = passport.authenticate('jwt', { session: false });


module.exports = function (app, config) {
    app.use('/api', router);

    router.route('/todos/user/:userid').get(function (req, res, next) {
        logger.log('Get all todos', 'verbose');

        //GET all User Handler

        var query = ToDo.find()
            .sort(req.query.order)
            .exec()
            .then(result => {
                if (result && result.length) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: 'No todos' });
                }
            })
            .catch(err => {
                return next(err);
            });
    })


    router.route('/todos/:todoID').get(function (req, res, next) {
        logger.log('Get todo' + req.params.todoID, 'verbose');

        todo.findById(req.params.todoID)
            .then(todo => {
                if (todo) {
                    res.status(200).json(todo);

                } else {
                    res.status(404).json({ message: "no todo found" });
                }
            })
            .catch(error => {
                return next(error);
            });
    });

    router.route('/todos').post(function (req, res, next) {
        logger.log('Create todo', 'verbose');

        var todo = new ToDo(req.body);
        todo.save()
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                return next(err);
            });
    });

    router.route('/todos/:todoID').put(function (req, res, next) {
        logger.log('Update todo', 'verbose');

        ToDo.findOneAndUpdate({ _id: req.params.todoID }, req.body, { new: true, multi: false })
        then(todo => {
            res.status(200).json(todo);
        })
            .catch(error => {
                return next(error);
            });

    });

    router.route('/todos/:todoID').delete(function (req, res, next) {
        logger.log('Delete todo', +req.params.todoID, 'verbose');
        //Delete Handler
        ToDo.remove({ _id: req.params.todoID })
            .then(todo => {
                res.status(200).json({ msg: "ToDo Deleted" });
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


    router.post('/todos/upload/:userId/:todoID', upload.any(), function (req, res, next) {
        logger.log('Upload file for todo ' + req.params.todoID + ' and ' + req.params.userId, 'verbose');

        ToDo.findById(req.params.todoID, function (err, todo) {
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



