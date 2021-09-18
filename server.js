const express = require('express');
var session = require("express-session");
var cors = require('cors')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

var corsOptions = {
    origin: '*',
    // origin: 'https://*.kyng.be',
    optionsSuccessStatus: 200,
}

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/restaurant', cors(corsOptions), (req, res) => {
    res.send('Post successful');
});

app.listen((port), () => {
    console.log(`Welcome to Lunch-Out's API, listening on port ${port}`);
});