const db = require("../models");
const User = db.users
const mongoose = require('mongoose');
const passport = require("passport")
    , LocalStrategy = require('passport-local').Strategy;
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
    // Create a user
    var id = mongoose.Types.ObjectId();
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

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
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Some error occurred while creating the user."
        });
    }
}

exports.findAll = (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {
        User.find().then(data => {
            return res.status(200).json({
                success: true,
                data: data
            });
        })
    }
}

// Retrieve a single User with id
exports.findOne = (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        User.find({ _id: req.params.id })
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
    }
}

// Retrieve a single User with id
exports.findOneByEmail = (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

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
    }
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
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        if (!req.body.id || !req.body.name) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        try {
            await User.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name })
            res.status(200).send({ success: true });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating User with id=" + req.body.id + ", errors: " + err
            })
        }
    }
}

// Update a User by id from the database.
exports.updatePassword = async (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        if (!req.body.id || !req.body.password) {
            res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
            return;
        }
        try {
            await User.findOneAndUpdate({ _id: req.body.id }, { password: req.body.password })
            res.status(200).send({ success: true });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating Review with id=" + req.body.id
            })
        }
    }
}

// Update a User by id from the database.
exports.updateEmail = async (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        if (!req.body.id || !req.body.email) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        try {
            await User.findOneAndUpdate({ _id: req.body.id }, { email: req.body.email })
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating Review with id=" + req.body.id
            })
        }
    }
}

exports.delete = async (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        if (!req.params.id) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
            return;
        }
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            if (!user) res.status(404).send("No item found")
            return res.status(200).json({ success: true })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Could not delete user with id=" + req.params.id
            })
        }
    }
}

exports.deleteAll = async (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        try {
            const user = await User.deleteMany()
            if (!user) res.status(404).json({
                success: false,
                message: "No item found"
            })
            return res.status(200).json({ success: true })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Could not delete users"
            })
        }
    }
}

// Delete all users of a particular lead from the database.
exports.deleteByLeadId = async (req, res) => {
    passport.authenticate('jwt', { session: false }), (req, res, next) => {

        try {
            const user = await User.deleteMany({ lead: req.params.id })
            if (!user) res.status(404).send("No item found")
            return res.status(200).json({ success: true })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Could not delete Users"
            })
        }
    }
};

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
