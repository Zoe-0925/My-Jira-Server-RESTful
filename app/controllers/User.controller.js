const db = require("../models");
const User = db.users
const mongoose = require('mongoose');
const passport = require("passport")
const BCRYPT_SALT_ROUNDS = 12;
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');
// , LocalStrategy = require('passport-local').Strategy;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }

    User.find({ email: req.body.email }).then(data => {
        if (data.email) {
            res.status(200).json({
                success: false,
                message: "Email already exists. " + data
            });
        }
    })

    // Create a user
    var id = mongoose.Types.ObjectId();
    const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
    const user = new User({
        _id: id,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        projects: []
    });
    try {
        await user.save()
        res.status(200).json({
            success: true,
        });
    } catch (err) {
        res.status(500).json({
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

/** 
exports.findMultiple = passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let error
    const results = req.body.map(each => {
        User.find({ _id: each }).then(data => data).catch(err => {
            error = {
                success: false,
                message: err.message || "Some error occurred while retrieving Users."
            };
        });
    });

    if (error) {
        res.status(500).json({
            success: false,
            message: err.message || "Some error occurred while retrieving Users."
        });
    }
    else {
        res.status(200).json({
            success: true,
            data: results
        });
    }
}

*/

exports.update = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (!req.body.email || !req.body.name) {
            res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        else {
            User.findOneAndUpdate({ email: user.email }, { name: user.name })
                .then(data => { return res.status(200).json({ success: true }); })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        message: "Error updating User with id=" + req.body.id + ", errors: " + err
                    })
                })(req, res, next);
        };
    })
}

exports.updatePassword = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (!req.body.password) {
            res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        else {
            bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                User.findOneAndUpdate({ email: user.email }, { password: hashedPassword })
                    .then(data => { return res.status(200).json({ success: true }); })
                    .catch(err => {
                        res.status(500).json({
                            success: false,
                            message: "Error updating Review with id=" + err
                        })
                    })(req, res, next);
            })
        };
    })
}

exports.updateEmail = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        console.log("authenicated")
        if ( !req.body.email) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        else {
            User.findOneAndUpdate({ email: user.email }, { email: req.body.newEmail })
                .then(data => { return res.status(200).json({ success: true }); })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                })(req, res, next);
        };
    })
}

exports.delete = (req, res) => {
    User.deleteOne({ email: req.params.id }, (err, result) => {
        if (err) res.status(404).json({
            success: false,
            message: "The user is not found"
        })
        else {
            res.status(200).json({ success: true, message: result });
        }
    })
}

exports.deleteAll = (req, res) => {
    User.deleteMany({}, (err, result) => {
        if (err) {
            res.status(404).json({
                success: false,
                message: err
            })
        } else {
            res.status(200).json({ success: true, message: result });
        }
    })
}

exports.login = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            if (info.message === 'bad username') {
                res.status(401).send(info.message);
            } else {
                res.status(403).send(info.message);
            }
        }
        else {
            req.logIn(user, () => {
                User.findOne({ email: req.body.email }).then(user => {
                    const token = jwt.sign({ email: user.email }, jwtSecret.secret);
                    res.status(200).json({
                        token: token,
                        success: true,
                        data: { name: user.name, projects: user.projects }
                    });
                });
            });
        }
    })(req, res, next);
}

exports.register = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            console.error(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            res.status(403).send(info.message);
        } else {
            // eslint-disable-next-line no-unused-vars
            req.logIn(user, error => {
                console.log(user);
                const data = {
                    name: req.body.name,
                    email: req.body.email,
                };
                console.log(data);
                User.findOne({ email: data.email }).then(user => {
                    console.log(user);
                    user.update({
                        name: data.name,
                        email: data.email,
                    })
                        .then((data) => {
                            console.log('user created in db');
                            res.status(200).json({ success: true });
                        });
                });
            });
        }
    })(req, res, next);
}


