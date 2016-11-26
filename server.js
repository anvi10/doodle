var express = require('express');
var app = express();
var User = require('./server/User'); 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieparse = require('cookie-parser');
var expresshb = require('express-handlebars');
var passport = require('passport');
var passlocal = require('passport-local').Strategy;
var expressSesh = require('express-session');
mongoose.connect("mongodb://localhost/doodle");

app.use(express.static(__dirname+'/views/static'));

//setting up function to render a view with an object
//associate all the handlebars files with the view engine
app.engine('handlebars', expresshb({defaultLayout:'main'}) );

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieparse());
 //anytime you have cookies it will decode them for us

app.use(expressSesh({
    secret: 'password',
    resave: false,
    saveUninitialized: true
    
} ));

passport.serializeUser(function(userobj, done) {
    done(null, userobj.username);
} );

passport.deserializeUser(function(username, done) {
    User.findOne({username: username}, function(err, user){
        if(err) {
            done(err);
            return; 
        }
        
        if(!user) { //user DNE. tell passport that theres no err from DB, but user just DNE
            done(null, false);
        } else {
            //no err, and the username exists in the database, so we wanna seriralize it. give the usr obj
            done(null, user);
        }
        
    });
} );

passport.use('local', new passlocal(function( username, password, done) {
    //make sure the user exists
    //make sure that the password matches with what that users password is
    User.findOne( {username:username}, function(err, user) {
        if (err) {
            done(err);
            return;
        }
        
        if (!user) {
            done(null, false);
        } else {
            if ( user.verifyPassword(password) ) {
                //match
                done (null, user);
            } else {
                done(null, false);
            }
        }
        
    } );
    
} ) );

app.use(passport.initialize() );
app.use(passport.session() );

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