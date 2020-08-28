const db = require("../models");
const Issue = db.issues
const Status = db.status
const Labels = db.labels
const passport = require("passport")


const validateIssue = (req, res) => {
    if (!req.body.project || !req.body.issueType || !req.body.summary) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }
}

const validateId = (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }
}

const validateIdAndType = (req, res) => {
    if (!req.params.id || !req.params.type) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }
}

exports.createCustomIssue = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
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
            return res.status(200).json({
                success: true,
                data: issue
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || "Some error occurred while creating the issue."
            });
        }
    })(req, res, next);
}

// Create and Save a new Issue
exports.create = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateIssue(req, res)
        // Create an issue
        const id = mongoose.Types.ObjectId();
        const issue = new issue({
            _id: id,
            project: req.body.project,
            summary: req.body.summary,
            issueType: req.body.issueType,
            description: req.body.description || "",
            status: req.body.status,
            assignee: user._id, //TODO query the user id and assign it here?
            labels: req.body.labels || [],
            due_date: req.body.due_date || null,
            reportee: req.body.reportee || "",  //TODO query the user id and assign it here?
            parent: req.body.issueType || null,
            chilren: req.body.issueType === "Subtask" ? null : [],
            comments: []
        });
        const status = Status.find({ _id: req.body.status })
        status.issues.push(issue)
        try {
            await issue.save()
            await status.save()
            return res.status(200).json({
                success: true,
                id: issue._id
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message || "Some error occurred while creating the issue."
            });
        }
    })(req, res, next);
}

exports.findAll = async (req, res) => {
    Issue.find().then(data => {
        return res.status(200).json({
            success: true,
            data: data
        })
    })
    //TODO Organize the code so that each task is inside epic...
    //Stream processing
}

exports.findOne = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        const data = await Issue.findById(req.params.id)
        res.status(200).json({
            success: true,
            data: data
        });
    })(req, res, next);
}

// Retrieve all issues in a project grouped by Status
exports.findLabelsAndIssuesAndStatus = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        const status = await Status.find({ project: req.params.id })
        const labels = await Labels.find({ project: req.params.id })
        const epics = await Issue.find({ project: req.params.id, type: "epic" })
        let tasks = new Map()
        let issues = await Issue.find({ project: req.params.id, type: "task" || "subtask" })
        issues.map(each => { tasks.set(each._id, each) })
        return res.status(200).json({
            success: true,
            tasks: tasks,
            epics: epics,
            labels: labels,
            status: status
        });
    })(req, res, next);
}

// Retrieve all issues in a project
exports.findForProject = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        try {
            const data = await Issue.find({ project: req.params.id })
            return res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

// Retrieve all issues involving a particular assignee
exports.findByAssignee = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        try {
            const data = await Issue.find({ assignee: req.params.id })
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

// Retrieve all issues involving a particular reportee
exports.findByReportee = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        try {
            const data = await Issue.find({ reportee: req.params.id })
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

exports.findByType = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        if (req.params.type) {
            res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }
        try {
            const data = await Issue.findById({ issueType: req.params.type })
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

// Retrieve all issues of a particular issue type in a project
exports.findByTypeForProject = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateIdAndType(req, res);
        try {
            const data = await Issue.findById({ project: req.params.id, issueType: req.params.type })
            return res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

// Retrieve all issues of a particular issue type and assignee id 
exports.findByTypeAndAssignee = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateIdAndType(req, res);
        try {
            const data = await Issue.findById({ assignee: req.params.id, issueType: req.params.type })
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

// Retrieve all children
exports.findChildren = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        try {
            const data = await Issue.findById(req.params.id)
            res.status(200).json({
                success: true,
                data: data.children
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

// Retrieve the parent
exports.findParent = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        try {
            const data = await Issue.findById(req.params.id)
            res.status(200).json({
                success: true,
                data: data.parent
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    })(req, res, next);
}

exports.update = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        try {
            const issue = await Issue.findByIdAndUpdate(req.params.id, req.body)
            await issue.save()
            return res.status(200).json({
                success: true
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating Issue. Error: " + err
            })
        }
    })(req, res, next);
}

exports.toggleFlag = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        try {
            let issue = await Issue.findById(req.params.id)
            issue.flag = !issue.flag
            await issue.save()
            return res.status(200).json({
                success: true
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating Issue. Error: " + err
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
        validateId(req, res);
        try {
            const issue = await Issue.findById(req.params.id)
            if (!issue) res.status(404).json({ success: false, message: "Could not find issue." })
            else {
                res.status(200).json({ success: true });
            }
        } catch (err) {
            res.status(500).json({
                message: "Could not delete issue with id=" + id + ". Error: " + err
            })
        }
    })(req, res, next);
}

exports.deleteAll = async (req, res) => {
    validateId(req, res);
    try {
        await Issue.deleteMany()
        return res.status(200).json({
            success: true
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Could not delete issues. Error: " + err
        })
    }
}

//TODO only the assignee can delete the issue?
//Or all team members can delete it???
//check the authorization

