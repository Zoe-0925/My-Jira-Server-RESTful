const BCRYPT_SALT_ROUNDS = 12;

const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    User = require("../models").users,
    JWTstrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    jwtSecret = require('./jwtConfig'),
    bcrypt = require('bcrypt'),
    mongoose = require('mongoose');

passport.use(
    'register',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
            session: false,
        },
        (req, username, password, done) => {
            try {
                User.findOne({ email: username }).then(user => {
                    if (user != null) {
                        return done(null, false, { message: 'username already taken' });
                    }
                    bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                        var id = mongoose.Types.ObjectId();
                        const user = new User({
                            _id: id,
                            name: req.body.name,
                            email: req.body.email,
                            password: hashedPassword,
                            projects: []
                        });
                        user.save().then(() => {
                            // note the return needed with passport local - remove this return for passport JWT to work
                            return done(null, user);
                        });
                    });
                });
            } catch (err) {
                done("passport error " + err);
            }
        },
    ),
);

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        },
        (username, password, done) => {
            try {
                User.findOne({ email: username }).then(user => {
                    if (user === null) {
                        return done(null, false, { message: 'Invalid username or password' });
                    } else {
                        bcrypt.compare(password, user.password).then(response => {
                            if (response !== true) {
                                return done(null, false, { message: 'Invalid username or password' });
                            }
                            // note the return needed with passport local - remove this return for passport JWT
                            return done(null, user);
                        });
                    }
                });
            } catch (err) {
                done(err);
            }
        },
    ),
);

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),  // Then JWT xxx
    secretOrKey: jwtSecret.secret,
};

passport.use(
    'jwt',
    new JWTstrategy(opts, (jwt_payload, done) => {
        try {
            User.findOne({ email: jwt_payload.email }).then(user => {
                if (user) {
                    // note the return removed with passport JWT - add this return for passport local
                    return done(null, user);
                } else {
                    console.log('user not found in db');
                    return done(null, false);
                }
            });
        } catch (err) {
            return done(err);
        }
    }),
);

var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ githubId: profile.id }, (err, user) => {
        return cb(err, user);
    });
}
));

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

