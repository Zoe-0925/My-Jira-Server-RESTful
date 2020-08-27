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
        res.status(200).json({
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
        res.status(200).json({
            success: true,
            id: id
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
            res.status(500).json({
                success: false,
                message: err.message || "Some error occurred while retrieving Users."
            });
        });
}

exports.findOne = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info != undefined) {
            res.json({ success: false, message: info.message });
        } else {
            User.find({ _id: req.params.id })
                .then(data => {
                    console.log('user found in db from route');
                    res.status(200).send({
                        success: true,
                        data: {
                            email: data.email,
                            name: data.name,
                            projects: data.projects
                        }
                    });
                })(req, res, next);
        };
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
        if (!req.body.id || !req.body.name) {
            res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        else {
            User.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name })
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
        if (!req.body.id || !req.body.password) {
            res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        else {
            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                User.findOneAndUpdate({ _id: req.body.id }, { password: hashedPassword })
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
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (!req.body.id || !req.body.email) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        else {
            User.findOneAndUpdate({ _id: req.body.id }, { email: req.body.email })
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
exports.updateEmail = (req, res, next) => {
    passport.authenticate('jwt', { session: false }), (err, user, info) => {
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
};


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

exports.login = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info != undefined) {
            console.log(info.message);
            res.json({ success: false, message: info.message });
        } else {
            req.logIn(user, err => {
                User.findOne({ email: req.body.email }).then(user => {
                    const token = jwt.sign({ id: user.email }, jwtSecret.secret);
                    res.status(200).json({
                        token: token,
                        success: true,
                        message: 'user found & logged in',
                    });
                });
            });
        }
    })(req, res, next);
}


