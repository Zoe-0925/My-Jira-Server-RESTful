const db = require("../models");
const User = db.users
const mongoose = require('mongoose');
const passport = require("passport")
// , LocalStrategy = require('passport-local').Strategy;
const utils = require('../helpers');

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }

    User.find({email:req.body.email}).then(data => {
        if(data){
            res.status(200).json({
                success: false,
                message:"Email already exists."
            });
        }
    })

    // Create a user
    var id = mongoose.Types.ObjectId();
    const user = new User({
        _id: id,
        name: req.body.name,
        email: req.body.email,
        hash: req.body.hash,
        salt: req.body.salt,
        projects: []
    });
    try {
        await user.save()
        return res.status(200).json({
            success: true,
            id: id
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Some error occurred while creating the user."
        });
    }
}

exports.findAll = (req, res, next) => {
    //  passport.authenticate('jwt', { session: false }), (req, res, next) => {
    User.find().then(data => {
        if(!data){
            res.json({data:[]})
        }
        res.json({
            success: true,
            data: data
        });
    })
    // }
}


// Retrieve a single User with id
exports.findOne = (req, res, next) => {
   // passport.authenticate('jwt', { session: false }), (req, res, next) => {

        User.find({ _id: req.params.id })
            .then(data => {
                res.status(200).json({
                    success: true,
                    data: data
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Some error occurred while retrieving Users."
                });
            });
   // }
}


// Retrieve a single User with id
exports.findOneByEmail = (req, res, next) => {
 //  passport.authenticate('jwt', { session: false }), (req, res, next) => {

        User.find({ email: req.params.email })
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Some error occurred while retrieving Users."
                });
            });
 //   }
}

// Retrieve a single User with id
exports.checkEmailExist = (req, res) => {

    User.find({ email: req.body.email })
        .then(data => {
            return res.status(200).json(data.email ? { success: true } : { success: false });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err.message || "Some error occurred while retrieving Users."
            });
        });
}

// Update a User by id from the database.
exports.update = async (req, res) => {
  //  passport.authenticate('jwt', { session: false }), (req, res, next) => {
        if (!req.body.id || !req.body.name) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        User.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name })
            .then(data => { return res.status(200).json({ success: true }); })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: "Error updating User with id=" + req.body.id + ", errors: " + err
                })
            });
  //  }
}

// Update a User by id from the database.
exports.updatePassword = (req, res) => {
 //   passport.authenticate('jwt', { session: false }), (req, res, next) => {
        if (!req.body.id || !req.body.password) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        User.findOneAndUpdate({ _id: req.body.id }, { password: req.body.password })
            .then(data => { return res.status(200).json({ success: true }); })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: "Error updating Review with id=" + err
                })
            });
   // }
}


// Update a User by id from the database.
exports.updateEmail = (req, res) => {
 //   passport.authenticate('jwt', { session: false }), (req, res, next) => {
        if (!req.body.id || !req.body.email) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }

        User.findOneAndUpdate({ _id: req.body.id }, { email: req.body.email })
            .then(data => { return res.status(200).json({ success: true }); })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: "Error updating Review with id=" + req.body.id
                })
            });
 //   }
}

exports.delete = (req, res) => {
//    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        if (!req.params.id) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        User.findByIdAndDelete(req.params.id).then(user => {
            if (!user) res.status(404).send("No item found")
            return res.status(200).json({ success: true })
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: "Could not delete user with id=" + req.params.id
            })
        });
 //   }
}



exports.deleteAll = (req, res) => {
 //   passport.authenticate('jwt', { session: false }), (req, res, next) => {
        User.deleteMany().then(user => {
            if (!user) res.status(404).json({
                success: false,
                message: "No item found"
            })
            return res.status(200).json({ success: true })
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: "Could not delete user"
            })
        });
  //  }
}


// Delete all users of a particular lead from the database.
exports.deleteByLeadId = (req, res) => {
 //   passport.authenticate('jwt', { session: false }), (req, res, next) => {
        User.deleteMany({ lead: req.params.id }).then(user => {
            if (!user) res.status(404).send("No item found")
            return res.status(200).json({ success: true })
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: "Could not delete user"
            })
        });
 //   }
}

exports.login = async (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(401).json({ success: false, msg: "could not find user" });
            }
            // Function defined at bottom of app.js
            const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

            if (isValid) {
                const tokenObject = utils.issueJWT(user);
                return res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
            } else {
                return res.status(401).json({ success: false, msg: "you entered the wrong password" });
            }
        })
        .catch((err) => {
            next(err);
        });
};



exports.signup = async (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.json({ success: false, message: "This email address is already registered." });
            }
        })

    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    var id = mongoose.Types.ObjectId();
    const user = new User({
        _id: id,
        name: req.body.name,
        email: req.body.email,
        hash: hash,
        salt: salt,
        projects: []
    });
    try {
        await user.save()
        return res.json({ success: true, user: user });
    } catch (err) {
        return res.json({ success: false, msg: err });
    }
};

/**
exports.loginAuthentication = passport.use(new LocalStrategy(
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));


exports.signupAuthentication = passport.use(new LocalStrategy(
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));
 */