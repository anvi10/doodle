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

app.use(bodyParser.urlencoded({extended: false}));

//setting up function to render a view with an object
//associate all the handlebars files with the view engine
app.engine('handlebars', expresshb({defaultLayout:'noauth'}) );

app.set('view engine', 'handlebars');



app.use(cookieparse());
 //anytime you have cookies it will decode them for us

app.use(expressSesh({
    secret: 'password',
    resave: false,
    saveUninitialized: true
    
} ));

passport.serializeUser(function(userobj, done) {
    console.log("serialize", userobj.username);
    done(null, userobj.username);
} );

passport.deserializeUser(function(username, done) {
    console.log("deserialize", username);
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
/*local names the login strategy that were defining. new passlocal actually gives it the strategy.
new pass local takes in a funct that will be called to verify if a password matches a users password*/
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
    if(req.isAuthenticated()) {
        res.render('citationgeneration', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('citationgeneration');
    }
} );

app.get('/login', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('login', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('login');
    }
} );

app.get('/createaccount', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('createaccount', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('createaccount');
    }
} );

app.get('/citationgeneration', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('citationgeneration', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('citationgeneration');
    }
} );

app.get('/journal', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('journal', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('journal');
    }
} );

app.get('/journalonline', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('journalonline', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('journalonline');
    }
} );


app.get('/journaldb', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('journaldb', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('journaldb');
    }
} );

app.get('/journalprint', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('journalprint', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('journalprint');
    }
} );

app.get('/website', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('website', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('website');
    }
} );

app.get('/book', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('book', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('book');
    }
} );

app.get('/video', function(req, res) {
    if(req.isAuthenticated()) {
        res.render('video', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('video');
    }
} );

app.post('/login', passport.authenticate('local'), function(req, res) {
    console.log(req.user.username);
    res.redirect('/citationgeneration');
} );

app.get('/logout', function(req,res) {
    //check that user is authenticated
    if (req.isAuthenticated() ) {
         req.logout();   
    } 
    res.redirect('/');
});

app.get('/viewcitations', function(req,res) {
    if(req.isAuthenticated()) {
        res.render('viewCitePage', {user: req.user, layout: 'auth'});
    }
    else {
        res.render('viewCitePage');
    }
});

app.post('/addcitation', function(req, res) {
    // after this
    User.findByIdAndUpdate( req.user._id, {
        $push : {
            "citations": req.body.citation 
        }
    },
    
        {
            new : true
        },
    function(err, model) {
        res.sendStatus(200); 
    }
    );
});

app.get('/getcitations', function(req, res) {
    console.log(req.user.citations);
    res.status(200).json( {
        citations: req.user.citations
    } );
});

app.post('/deletecitation', function(req, res) {
    req.user.citations.splice(req.body.index, 1);
        req.user.save();
});


app.post('/createaccount', function(req, res) {
    //store user in database
    
    /*
    console.log(req.body.username);
    */
    User.findOne({username: req.body.username}, function(err, user) { //checks username is unique
        if(user) {
            //username exists
            res.render('create', {error: 'Username already exists'});
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