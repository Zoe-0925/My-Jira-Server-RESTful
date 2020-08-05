const db = require("../models");
const Status = db.status

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
    if (!req.body.name || !req.body.project) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }

    // Create a status
    const id = mongoose.Types.ObjectId();
    const status = new Status({
        _id: id,
        name: req.body.name,
        project: req.body.project
    });
    try {
        await status.save()
        res.status(200).send(status);
    } catch (err) {
        res.status(500).send({
            message:
                err || "Some error occurred while creating the status."
        });
    }
}

// Retrieve all statuss involving a particular user
exports.findAll = (req, res) => {
    Status.find().then(data => { res.status(200).send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Statuss."
            });
        });
}

// Retrieve a single Status with id
exports.findOne = (req, res) => {
    validateId(req, res);
    Status.find({ _id: req.params.id }).then(data => { res.status(200).send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Statuss."
            });
        });
}

// Retrieve all Statuss in a particular project
exports.findByProject = (req, res) => {
    validateId(req, res);
    Status.find({ project: req.params.id }).then(data => { res.status(200).end(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Statuss."
            });
        });
}

exports.update = (req, res) => {
    validateId(req, res);
    Status.findByIdAndUpdate(req.params.id).then(data => { res.status(200).send("Successful"); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving Statuss."
            });
        });
}

// Delete all Status
exports.deleteAll = (req, res) => {
    Status.deleteMany()
        .then(() => {
            res.status(200).send("Successful");
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while deleting Status. "
            });
        });
}


// Retrieve all Statuss involving a particular user
exports.deleteById = (req, res) => {
    validateId(req, res);
    Status.findByIdAndDelete(req.params.id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while deleting Status."
            });
        });
}


