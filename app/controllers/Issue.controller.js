const db = require("../models");
const Issue = db.issues

const validateIssue = (req, res) => {
    if (!req.body.project || !req.body.issueType || !req.body.summary) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
}

const validateId = (req, res) => {
    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
}

const validateIdAndType = (req, res) => {
    if (!req.params.id || !req.params.type) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
}

exports.createCustomIssue = async (req, res) => {
    validateIssue(req, res)
    // Create an issue
    const id = mongoose.Types.ObjectId();
    const issue = new issue({
        _id: id,
        project: req.body.project,
        summary: req.body.summary,
        issueType: req.body.issueType,
        description: req.body.description || "",
        status: "Not Started",
        assignee: req.body.assignee || "", //TODO query the user id and assign it here?
        labels: req.body.labels || [],
        due_date: req.body.due_date || null,
        reportee: req.body.reportee || "",  //TODO query the user id and assign it here?
        parent: req.body.parent || null,
        chilren: req.body.children || [],
        comments: []
    });
    try {
        await issue.save()
        res.status(200).send(issue);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the issue."
        });
    }
}

// Create and Save a new Issue
exports.create = async (req, res) => {
    validateIssue(req, res)
    // Create an issue
    const id = mongoose.Types.ObjectId();
    const issue = new issue({
        _id: id,
        project: req.body.project,
        summary: req.body.summary,
        issueType: req.body.issueType,
        description: req.body.description || "",
        status: "Not Started",
        assignee: req.body.assignee || "", //TODO query the user id and assign it here?
        labels: req.body.labels || [],
        due_date: req.body.due_date || null,
        reportee: req.body.reportee || "",  //TODO query the user id and assign it here?
        parent: req.body.issueType || null,
        chilren: req.body.issueType === "Subtask" ? null : [],
        comments: []
    });
    try {
        await issue.save()
        res.status(200).send({ success: true, id: issue._id });
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the issue."
        });
    }
}

exports.findAll = async (req, res) => {
    Issue.find().then(data => {
        res.status(200).send(data);
    })
    //TODO Organize the code so that each task is inside epic...
    //Stream processing
}

exports.findOne = async (req, res) => {
    validateId(req, res);
    Issue.findById(req.params.id).then(data => {
        res.status(200).send(data);
    })
}

// Retrieve all issues in a project
exports.findForProject = async (req, res) => {
    validateId(req, res);
    Issue.find({ project: req.params.id }).then(data => {
        res.status(200).send(data);
    })
}

// Retrieve all issues involving a particular assignee
exports.findByAssignee = async (req, res) => {
    validateId(req, res);
    Issue.find({ assignee: req.params.id }).then(data => {
        res.status(200).send(data);
    })
}

// Retrieve all issues involving a particular reportee
exports.findByReportee = async (req, res) => {
    validateId(req, res);
    Issue.find({ reportee: req.params.id }).then(data => {
        res.status(200).send(data);
    })
}

exports.findByType = async (req, res) => {
    if (req.params.type) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    Issue.findById({ issueType: req.params.type }).then(data => {
        res.status(200).send(data);
    })
}

// Retrieve all issues of a particular issue type in a project
exports.findByTypeForProject = async (req, res) => {
    validateIdAndType(req, res);
    Issue.findById({ project: req.params.id, issueType: req.params.type })
        .then(data => {
            res.status(200).send(data);
        })
}

// Retrieve all issues of a particular issue type and assignee id 
exports.findByTypeAndAssignee = async (req, res) => {
    validateIdAndType(req, res);
    Issue.findById({ assignee: req.params.id, issueType: req.params.type })
        .then(data => {
            res.status(200).send(data);
        })
}

// Retrieve all children
exports.findChildren = async (req, res) => {
    validateId(req, res);
    Issue.findById(req.params.id).then(data => {
        res.status(200).send(data.children);
    })
}

// Retrieve the parent
exports.findParent = async (req, res) => {
    validateId(req, res);
    Issue.findById(req.params.id).then(data => {
        res.status(200).send(data.parent);
    })
}

exports.update = async (req, res) => {
    validateId(req, res);
    try {
        const project = await Issue.findByIdAndUpdate(req.params.id, req.body)
        await project.save()
        res.status(200).send({ success: true });
    } catch (err) {
        res.status(500).send({
            message: "Error updating Review with id=" + id
        })
    }
}

exports.delete = (req, res) => {
    validateId(req, res);
    try {
        Issue.findById(req.params.id).then(
            issue => {
                if (!issue) res.status(404).send({ failure: true })
                else {
                    res.status(200).send({ success: true })
                }
            }
        )
    } catch (err) {
        res.status(500).send({
            message: "Could not delete issue with id=" + id + ". Error: " + err
        })
    }
}

exports.deleteAll = async (req, res) => {
    validateId(req, res);
    try {
        await Issue.deleteMany()
        res.status(200).send({ success: true })
    }
    catch (err) {
        res.status(500).send({
            message: "Could not delete issues. Error: " + err
        })
    }
}

//TODO only the assignee can delete the issue?
//Or all team members can delete it???
//check the authorization

