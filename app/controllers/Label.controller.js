const db = require("../models");
const Label = db.labels

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }

    // Create a label
    const label = new Label({
        name: req.body.name
    });
    try {
        await label.save()
        res.send(label);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the label."
        });
    }
}

// Retrieve all projects involving a particular user
exports.findAll = (req, res) => {
    Label.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving labels."
            });
        });
}

// Retrieve all projects involving a particular user
exports.deleteById = (req, res) => {
    Label.findByIdAndDelete(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting label."
            });
        });
}