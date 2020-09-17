const db = require("../models");
const Project = db.projects
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const passport = require("passport")

const validateId = (req, res) => {
    if (!req.params.id) {
        res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }
}

// Create and Save a new Tutorial
exports.create = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        // Validate request
        if (!req.body.name) {
            res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }

        // Create a project
        const id = mongoose.Types.ObjectId();
        const project = new Project({
            _id: id,
            name: req.body.name,
            key: uuidv4(),
            lead: user._id,
            members: [user._id],
            image: req.body.image || "",
            default_assignee: "Project Lead",
        });
        try {
            user.projects.push(id)
            await project.save()
            await user.save()
            res.status(200).json({ success: true, id: id });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Some error occurred while creating the Project."
            });
        }
    })(req, res, next);
}

exports.findAll = (req, res) => {
    Project.find().then(data => {
        res.status(200).json({ success: true, data: data });
    })
}

// Retrieve all projects involving a particular user
exports.findByUserId = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res)
        Project.find({ members: req.params.id })
            .then(data => {
                return res.status(200).json({ success: true, data: data });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err.message || "Some error occurred while retrieving projects."
                });
            });
    })(req, res, next);
}

// Retrieve a single project with id
exports.findOne = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res)
        Project.find({ key: req.params.id })
            .then(data => {
                res.status(200).json({ success: true, data: data });
            }).catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred while retrieving projects."
                });
            });
    })(req, res, next);
}

// Update a project by id from the database.
exports.update = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res)
        try {
            const project = await Project.findByIdAndUpdate(req.params.id, req.body)
            await project.save({
                message: "Project was updated successfully."
            })
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({
                message: `Error updating Review with id=$(id), $(err)`
            })
        }
    })(req, res, next);
}

// Remove a member from a project by id.
exports.removeMember = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        // Validate request
        if (!req.params.id || !req.params.userId) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        try {
            const project = await Project.findById(req.params.id, req.body)
            //If the member to be deleted is also the project lead, delete the project lead as well.
            if (req.params.userId === project.lead) {
                project.lead = ""
            }
            project.members.filter(req.params.userId)
            await project.save({
                message: "Project was updated successfully."
            })
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: `Could not update Project with id=$(id). Error:$(err) `
            })
        }
    })(req, res, next);
}

exports.delete = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        if (!req.params.id) {
            res.status(200).send({ success: true });
        }
        try {
            const project = await Project.findByIdAndDelete(req.params.id)
            if (!project) res.status(404).send("No item found")
            res.status(200).send({ success: true })
        } catch (err) {
            res.status(500).json({
                message: `Could not delete Project with id=$(id). Error:$(err) `
            })
        }
    })(req, res, next);
}

exports.deleteAll = async (req, res) => {
    try {
        const project = await Project.deleteMany()
        if (!project) return res.status(200).json({ success: false, message: "No item found" })
        res.status(200).json({ success: true })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Could not delete Projects"
        })
    }
}

// Delete all Projects of a particular lead from the database.
exports.deleteByLeadId = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        try {
            const project = await Project.deleteMany({ lead: req.params.id })
            if (!project) res.status(404).send("No item found")
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Could not delete Projects"
            })
        }
    })(req, res, next);
}

