const db = require("../models");
const User = db.users
const mongoose = require('mongoose');

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }

    // Create a user
    var id = mongoose.Types.ObjectId();
    const user = new User({
        _id: id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        projects: []
    });
    try {
        await user.save()
        return res.send(user);
    } catch (err) {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while creating the user."
        });
    }
}

exports.addProject = async (req, res) => {
    // Validate request
    if (!req.params.id || !req.body.projectId) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    // Insert the project id to the user's projects.
    let user = await User.find({ _id: req.params.id })
    user.projects.push(req.body.projectId)
    try {
        await user.save()
        return res.status(200).send(user);
    } catch (err) {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while creating the user."
        });
    }

}


exports.findAll = (req, res) => {
    User.find().then(data => {
        return res.send(data);
    })
}

// Retrieve a single User with id
exports.findOne = (req, res) => {
    User.find({ _id: req.params.id })
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
}

// Retrieve a single User with id
exports.findOneByEmail = (req, res) => {
    User.find({ email: req.params.email })
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
}

// Retrieve a single User with id
exports.checkEmailExist = (req, res) => {
    User.find({ email: req.body.email })
        .then(data => {
            return res.status(200).send(data.email ? { success: true } : { failure: true });
        })
        .catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
}

// Update a User by id from the database.
exports.update = async (req, res) => {
    if (!req.body.id || !req.body.name) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    try {
        await User.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name })
        res.status(200).send({ success: true });
    } catch (err) {
        return res.status(500).send({
            message: "Error updating User with id=" + req.body.id + ", errors: " + err
        })
    }
}

// Update a User by id from the database.
exports.updatePassword = async (req, res) => {
    if (!req.body.id || !req.body.password) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    try {
        await User.findOneAndUpdate({ _id: req.body.id }, { password: req.body.password })
        res.status(200).send({ success: true });
    } catch (err) {
        return res.status(500).send({
            message: "Error updating Review with id=" + req.body.id
        })
    }
}

// Update a User by id from the database.
exports.updateEmail = async (req, res) => {
    if (!req.body.id || !req.body.email) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    try {
        await User.findOneAndUpdate({ _id: req.body.id }, { email: req.body.email })
        res.status(200).send({ success: true });
    } catch (err) {
        return res.status(500).send({
            message: "Error updating Review with id=" + req.body.id
        })
    }
}

exports.delete = async (req, res) => {
    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) res.status(404).send("No item found")
        return res.status(200).send({ success: true })
    } catch (err) {
        return res.status(500).send({
            message: "Could not delete user with id=" + req.params.id
        })
    }
}

exports.deleteAll = async (req, res) => {
    try {
        const user = await User.deleteMany()
        if (!user) res.status(404).send("No item found")
        return res.status(200).send({ success: true })
    } catch (err) {
        return res.status(500).send({
            message: "Could not delete users"
        })
    }
}

// Delete all users of a particular lead from the database.
exports.deleteByLeadId = async (req, res) => {
    try {
        const user = await User.deleteMany({ lead: req.params.id })
        if (!user) res.status(404).send("No item found")
        return res.status(200).send({ success: true })
    } catch (err) {
        return res.status(500).send({
            message: "Could not delete Users"
        })
    }
};


