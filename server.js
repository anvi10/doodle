var express = require('express');
var app = express();
var User = require('./server/User'); 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieparse = require('cookie-parser');
var expresshb = require('express-handlebars');
mongoose.connect("mongodb://localhost/doodle");

//setting up function to render a view with an object
//associate all the handlebars files with the view engine
app.engine('handlebars', expresshb({defaultLayout:'main'}) );

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieparse());
 //anytime you have cookies it will decode them for us
app.use(express.static(__dirname+'/views/static'));

//function that respond to home page
app.get('/', function(req, res) {
    res.render('index');
} );

app.get('/login', function(req, res) {
    res.render('login');
} );

app.get('/create', function(req, res) {
    res.render('create');
} );

app.get('/citationgeneration', function(req, res) {
    res.render('citationgeneration');
} );

app.get('/journal', function(req, res) {
    res.render('journal');
} );

app.get('/website', function(req, res) {
    res.render('website');
} );

app.get('/book', function(req, res) {
    res.render('book');
} );

app.get('/video', function(req, res) {
    res.render('video');
} );

app.post('/createaccount', function(req, res) {
    //store user in database
    
    /*
    console.log(req.body.username);
    */
    User.findOne({username: req.body.username}, function(err, user) { //checks username is unique
        if(user) {
            //username exists
            res.render('create', {error: 'username exists'});
            //redirect to create account with error
        }
        else {
            //username does not exist
            var user = new User();
            user.username = req.body.username;
            user.password = req.body.password;
            user.save();
            res.redirect('/citationgeneration'); 
        }
    });
});

app.listen(3001);