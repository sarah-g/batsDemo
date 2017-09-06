var express = require('express');
var router = express.Router();
var request = require('request');

var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
    if(sess.username){
        res.redirect('/topics');
    }else{
        res.render('index');
    }
});

router.post('/login', function(req, res, next){
    sess = req.session;

    //check if this username and password is valid for OpenSensors.io
    var options = {
        method: 'post',
        json: true,
        url: 'https://api.opensensors.io/v1/login',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: {
            'username': req.body.username,
            'password': req.body.password
        }
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            sess.username=req.body.username;
            sess.topic=req.body.topic;
            sess.token=body.token;
            //console.log("Got token = "+sess.token);
            //res.end('done');
            res.render('topics', {username:sess.username, token: sess.token, topic: sess.topic});
        }else{
            console.log('Error - '+error);
            //console.log('Response code - '+response.statusCode);
            //display login page with error
            res.redirect('/');
        }
    });
});

router.get('/topics', function(req, res, next) {
    sess = req.session;
    if(sess.username) {
        //res.write('<h1>Logged in as '+sess.username+'</h1>');
        //res.end('<form action="/logout"><input type="submit" value="Logout"></form>');
        //res.end('<a href="/">Logout</a>');
        res.render('topics', {username:sess.username, token: sess.token});
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<form action="/"><input type="submit" value="Login"></form>');
        //res.end('<a href="/">Login</a>');
    }
});

router.get('/logout',function(req,res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
