var bodyParser = require('body-parser');
var currentUser = require('../middleware/authorize')();
var notLoggedIn = require('../middleware/not_logged_in');
var model = require('../model');
console.log('Importing opinions');
module.exports = function (app) {
    app.post('/comments', bodyParser.json(), currentUser, notLoggedIn, function(req, res) {
        model.Opinion.findById(req.body.comment.OpinionId).then(function(opinion) {
            if (opinion) {
                model.Comment.create({
                    OpinionId: req.body.comment.OpinionId,
                    UserId: req.currentUser.id,
                    content: req.body.comment.content
                }).then(function(comment) {
                    res.sendStatus(201);
                }).catch(function(error) {
                    console.log(error);
                    res.sendStatus(400);
                })
            } else {
                res.sendStatus(404);
            }
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        })
    });
};