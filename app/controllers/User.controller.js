const db = require("../models");
const User = db.users
const mongoose = require('mongoose');
const passport = require("passport")
// , LocalStrategy = require('passport-local').Strategy;
const utils = require('../Util');

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }

    User.find({ email: req.body.email }).then(data => {
        if (data) {
            res.status(200).json({
                success: false,
                message: "Email already exists."
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
    User.find().then(data => {
        if (!data) {
            res.json({ data: [] })
        }
        res.json({
            success: true,
            data: data
        });
    })
}

// Retrieve a single User with id
exports.findOne = passport.authenticate('jwt', { session: false }), (req, res, next) => {
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
}



// Retrieve a single User with id
exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(401).json({ success: false, msg: "could not find user" });
            }
            const isValid = req.body.salt === user.salt && req.body.hash === user.hash
            if (isValid) {
                const tokenObject = utils.issueJWT(user);
                res.status(200).json({
                    success: true, data: user,
                    token: tokenObject.token, expiresIn: tokenObject.expires
                });
            } else {
                res.status(401).json({ success: false, msg: "you entered the wrong password" });
            }

        })
        .catch((err) => {
            next(err);
        });
}

// Update a User by id from the database.
exports.update = passport.authenticate('jwt', { session: false }), (req, res, next) => {
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
}


// Update a User by id from the database.
exports.updatePassword = passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if (!req.body.id || !req.body.salt || req.body.hash) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }
    User.findOneAndUpdate({ _id: req.body.id }, { salt: req.body.salt, hash: req.body.hash })
        .then(data => { return res.status(200).json({ success: true }); })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: "Error updating Review with id=" + err
            })
        });
}



// Update a User by id from the database.
exports.updateEmail = passport.authenticate('jwt', { session: false }), (req, res, next) => {
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
                message: "Error updating Review. " + err
            })
        });
}

exports.delete = passport.authenticate('jwt', { session: false }), (req, res, next) => {
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
}



exports.deleteAll = (req, res) => {
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
}


// Delete all users of a particular lead from the database.
exports.deleteByLeadId = passport.authenticate('jwt', { session: false }), (req, res, next) => {
    User.deleteMany({ lead: req.params.id }).then(user => {
        if (!user) res.status(404).send("No item found")
        return res.status(200).json({ success: true })
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: "Could not delete user"
        })
    });
}
