const db = require("../models");
const Issue = db.issues
const { v4: uuidv4 } = require('uuid');

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.summary || !req.body.issueType) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }

    // Create an issue
    const issue = new issue({
        project: req.body.project,
        summary: req.body.summary,
        issueType: req.body.issueType,
        description: req.body.description || "",
        status: "Not Started",
        assignee: req.body.assignee || "", //TODO query the user id and assign it here?
        labels: req.body.labels || [],
        due_date: req.body.due_date || null,
        reporter: req.body.reporter || "",  //TODO query the user id and assign it here?
        parent: req.body.issueType === "Epic" ? "" : (req.body.parent || ""),
        chilren: req.body.issueType === "Subtask" ? [] : (req.body.chilren || []),
        comments: []
    });
    try {
        await issue.save()
        res.send(issue);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the issue."
        });
    }
}

exports.findAllByProjectId = async (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    Issue.find({ project: req.params.id }).then(data => {

        res.send(data);
    })

    //TODO Organize the code so that each task is inside epic...
    //Stream processing

}

exports.findById = async (req, res) => {
    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    Issue.findById(req.params.id).then(data => {
        res.send(data);
    })
}

exports.update = async (req, res) => {
    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body)
    await issue.save({
        message: "Issue was updated successfully."
    })
    res.send(issue)
}

exports.delete = async (req, res) => {

    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
    }
    try {
        const issue = await Issue.findById(req.params.id)
        if (!issue) res.status(404).send("No item found")

        //TODO
        //If the issue has children, send a different status code

        //But I think it returns a cursor object, so the query is not like this
        if (issue.children.length > 0 && !req.params.force) {
            res.status(500).send({
                message: "This issue has chilren remained!"
            })
        }
        else {
            res.status(200).send({
                message: "issue was deleted successfully!"
            })
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete issue with id=" + id
        })
    }

}