const db = require("../models");
const Label = db.labels

const validateId = (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }
}

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.project) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
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
        return res.status(200).json({ success: true, id: label._id });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while creating the label."
        });
    }
}

// Retrieve all labels involving a particular user
exports.findAll = (req, res) => {
    Label.find().then(data => { return res.status(200).json({ success: true, data: data }); })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving labels."
            });
        });
}

// Retrieve a single label with id
exports.findOne = (req, res) => {
    validateId(req, res);
    Label.find({ _id: req.params.id }).then(data => {
        return res.status(200).json({ success: true, data: data });
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while retrieving labels."
        });
    });
}

// Retrieve all labels in a particular project
exports.findByProject = (req, res) => {
    validateId(req, res);
    Label.find({ project: req.params.id }).then(data => {
        return res.status(200).json({ success: true, data: data });
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while retrieving labels."
        });
    });
}

exports.update = (req, res) => {
    validateId(req, res);
    Label.findByIdAndUpdate(req.params.id).then(data => {
        return res.status(200).json({ success: true });
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while retrieving labels."
        });
    });
}

// Delete all label
exports.deleteAll = (req, res) => {
    Label.deleteMany()
        .then(() => {
            return res.status(200).json({ success: true });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while deleting label. "
            });
        });
}


// Retrieve all labels involving a particular user
exports.delete = (req, res) => {
    validateId(req, res);
    Label.findByIdAndDelete(req.params.id)
        .then(data => {
            return res.status(200).json({ success: true });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while deleting label."
            });
        });
}


