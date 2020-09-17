const db = require("../models");
const User = db.users
const mongoose = require('mongoose');
const passport = require("passport")
const BCRYPT_SALT_ROUNDS = 12;
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');
require("regenerator-runtime/runtime");

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
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (!req.body.email || !req.body.name) {
            res.status(200).json({
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message)
        }
        try {
            await User.updateOne({ email: user.email }, { name: user.name })
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({
                message: "Error updating User with id=" + req.body.id + ", errors: " + err
            })
        }
    })(req, res, next);
}

//TODO bcrypt: data and salt arguments required
//TODO change to async await
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
        if (info !== undefined) {
            res.status(403).send(info.message)
        }
        else {
            bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                User.updateOne({ email: user.email }, { password: hashedPassword })
                    .then(data => { return res.status(200).json({ success: true, data: data }); })
                    .catch(err => {
                        res.status(500).json({
                            message: "Error updating Review with id=" + err
                        })
                    })
            })
        };
    })(req, res, next);
}

exports.updateEmail = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        console.log("authenicated")
        if (!req.body.email) {
            return res.status(200).json({
                message: "The content body can not be empty."
            });
        }
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            res.status(403).send(info.message)
        }
        else {
            try {
                await User.updateOne({ email: user.email }, { email: req.body.newEmail })
            } catch (err) {
                return res.status(500).json({
                    message: err
                })
            }
            await User.updateOne({ email: user.email }, { email: req.body.newEmail })
            return res.status(200).json({ success: true });
        };
    })(req, res, next);
}

exports.delete = async (req, res) => {
    await User.deleteOne({ email: req.params.id }, (err, result) => {
        if (err) res.status(404).json({
            message: "The user is not found"
        })
        else {
            res.status(200).json({ success: true, message: result });
        }
    })
}

exports.deleteAll = async (req, res) => {
    const { err, result } = await User.deleteMany({})
    await Status.save()
    if (err) {
        res.status(404).json({ message: err })
    } else {
        res.status(200).json({ success: true, message: result });
    }
}

exports.login = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
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

exports.redirectToGitHubLogin = (req, res, next) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
}

exports.gitHubLogin = passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    //Save the user information into the session
    /** 
    req.session.user = {
        _id: req.user.id,
        name: req.user.displayName || req.user.username,
        //   avatar: req.user._json.avatar_url,
        provider: req.user.provider
    };
    */
    //TODO where to save the user info???
    res.redirect('/');
}

exports.logOut = (req, res, next) => {
    req.session.destroy();  //for git hub log in
    res.redirect('/login');
}