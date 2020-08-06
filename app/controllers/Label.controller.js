const db = require("../models");
const Label = db.labels

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

    // Create a label
    const id = mongoose.Types.ObjectId();
    const label = new Label({
        _id: id,
        name: req.body.name,
        project: req.body.project
    });
    try {
        await label.save()
        res.status(200).send({ success: true, id: label._id });
    } catch (err) {
        res.status(500).send({
            message:
                err || "Some error occurred while creating the label."
        });
    }
}

// Retrieve all labels involving a particular user
exports.findAll = (req, res) => {
    Label.find().then(data => { res.status(200).send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving labels."
            });
        });
}

// Retrieve a single label with id
exports.findOne = (req, res) => {
    validateId(req, res);
    Label.find({ _id: req.params.id }).then(data => { res.status(200).send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving labels."
            });
        });
}

// Retrieve all labels in a particular project
exports.findByProject = (req, res) => {
    validateId(req, res);
    Label.find({ project: req.params.id }).then(data => { res.status(200).send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving labels."
            });
        });
}

exports.update = (req, res) => {
    validateId(req, res);
    Label.findByIdAndUpdate(req.params.id).then(data => {
        res.status(200).send({ success: true });
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while retrieving labels."
            });
        });
}

// Delete all label
exports.deleteAll = (req, res) => {
    Label.deleteMany()
        .then(() => {
            res.status(200).send({ success: true });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while deleting label. "
            });
        });
}


// Retrieve all labels involving a particular user
exports.delete = (req, res) => {
    validateId(req, res);
    Label.findByIdAndDelete(req.params.id)
        .then(data => {
            res.status(200).send({ success: true });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err || "Some error occurred while deleting label."
            });
        });
}


