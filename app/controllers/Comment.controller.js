const db = require("../models");
const Comment = db.comments

const validateId = (req, res) => {
    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
}

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.author || !req.body.project || !req.body.description ||!req.body.issue) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }

    // Create a comment
    const id = mongoose.Types.ObjectId();
    const comment = new Comment({
        _id: id,
        project: req.body.project,
        author: req.body.author,
        description: req.body.description,
        date: new Date(),
        issue: req.body.issue,
        parent: req.body.parent||""
    });
    try {
        await comment.save()
        res.status(200).send(comment);
    } catch (err) {
        res.status(500).send({
            message:
                err || "Some error occurred while creating the comment."
        });
    }
}

// Retrieve all comments involving a particular user
exports.findAll = (req, res) => {
    Comment.find().sort({'date': 'ascd'})
    .then(data => { res.status(200).send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Comments."
            });
        });
}

// Retrieve a single Comment with id
exports.findOne = (req, res) => {
    validateId(req, res);
    Comment.find({ _id: req.params.id }).then(data => { res.status(200).send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Comments."
            });
        });
}

// Retrieve all Comments in a particular project
exports.findByProject = (req, res) => {
    validateId(req, res);
    Comment.find({ project: req.params.id }).sort({'date': 'ascd'})
    .then(data => { res.status(200).end(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Comments."
            });
        });
}

// Retrieve all Comments in a particular project
exports.findForIssue = (req, res) => {
    validateId(req, res);
    Comment.find({ issue: req.params.id }).sort({'date': 'ascd'})
    .then(data => { res.status(200).end(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Comments."
            });
        });
}

exports.findChildren = (req, res) => {
    validateId(req, res);
    Comment.find({ parent: req.params.id }).sort({'date': 'ascd'})
    .then(data => { res.status(200).end(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Comments."
            });
        });
}

exports.update = (req, res) => {
    validateId(req, res);
    Comment.findByIdAndUpdate(req.params.id).then(data => { res.status(200).send("Successful"); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Comments."
            });
        });
}

// Delete all Comment
exports.deleteAll = (req, res) => {
    Comment.deleteMany()
        .then(() => {
            res.status(200).send("Successful");
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while deleting Comment. "
            });
        });
}


// Retrieve all Comments involving a particular user
exports.delete = (req, res) => {
    validateId(req, res);
    Comment.findByIdAndDelete(req.params.id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while deleting Comment."
            });
        });
}

exports.deleteByIssue = (req, res) => {
    Comment.deleteMany({issue:req.params.id})
        .then(() => {
            res.status(200).send("Successful");
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while deleting Comment. "
            });
        });
}