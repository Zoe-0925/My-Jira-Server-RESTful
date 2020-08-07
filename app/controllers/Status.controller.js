const db = require("../models");
const Status = db.status

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

    // Create a status
    const id = mongoose.Types.ObjectId();
    const status = new Status({
        _id: id,
        name: req.body.name,
        project: req.body.project
    });
    try {
        await status.save()
        return res.status(200).json({
            success: true, id: status._id
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while creating the status."
        });
    }
}

// Retrieve all statuss involving a particular user
exports.findAll = (req, res) => {
    Status.find().then(data => { res.status(200).send(data); })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
            });
        });
}

// Retrieve a single Status with id
exports.findOne = (req, res) => {
    validateId(req, res);
    Status.find({ _id: req.params.id }).then(data => {
        return res.status(200).json({
            success: true,
            data: data
        });
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while retrieving Statuss."
        });
    });
}

// Retrieve all Statuss in a particular project
exports.findByProject = (req, res) => {
    validateId(req, res);
    Status.find({ project: req.params.id }).then(data => {
        return res.status(200).json({
            success: true,
            data: data
        });
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while retrieving Statuss."
        });
    });
}

exports.update = (req, res) => {
    validateId(req, res);
    Status.findByIdAndUpdate(req.params.id).then(data => {
        return res.status(200).json({
            success: true,
            data: data
        });
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: err || "Some error occurred while retrieving Statuss."
        });
    });
}

// Delete all Status
exports.deleteAll = (req, res) => {
    Status.deleteMany()
        .then(() => {
            return res.status(200).json({ success: true });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while deleting Status. "
            });
        });
}


// Retrieve all Statuss involving a particular user
exports.delete = (req, res) => {
    validateId(req, res);
    Status.findByIdAndDelete(req.params.id)
        .then(data => {
            return res.status(200).json({ success: true });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while deleting Status. "
            });
        });
}


