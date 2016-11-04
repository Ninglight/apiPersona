// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var jwt = require('express-jwt');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 2604;        // set our port

mongoose.connect('mongodb://localhost/persona'); // connect to our database

var User = require('./app/models/user');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:2604/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')

    // create a user (accessed at POST http://localhost:2604/api/users)
    .post(function(req, res) {

        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;   // set the user name (comes from the request)
        user.firstName = req.body.firstName;   // set the user name (comes from the request)

        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });

    })

    // get all the users (accessed at GET http://localhost:2604/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

    // get the user with that id (accessed at GET http://localhost:2604/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    // update the user with this id (accessed at PUT http://localhost:2604/api/users/:user_id)
    .put(function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  // update the users info
            user.firstName = req.body.firstName;  // update the users info

            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'user updated!' });
            });

        });
    })

    // delete the user with this id (accessed at DELETE http://localhost:2604/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
