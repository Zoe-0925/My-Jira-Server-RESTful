module.exports = app => {
    const issues = require("../controllers/Issue.controller.js");
    var router = require("express").Router();

    // Create a new issue (Issuetype: Epic, Task or Subtask)
    router.post("/", issues.create);

    // Create a new issue with customsed issue type
    router.post("/", issues.createCustomIssue);

    // Retrieve all issues
    router.get("/", issues.findAll);

    // Retrieve all issues of a particular issue type
    router.get("/user/:id/issueType/:type", issues.findByType);

    router.get("/project/board/:id/", issues.findLabelsAndIssuesGroupByStatus);

    // Retrieve all issues in a project
    router.get("/project/:id/", issues.findForProject);

    // Retrieve all issues of a particular issue type in a project
    router.get("/project/:id/issueType/:type", issues.findByTypeForProject);

    // Retrieve all issues of a particular issue type and assignee id 
    router.get("/assignee/:id/issueType/:type", issues.findByTypeAndAssignee);

    // Retrieve all issues involving a particular assignee
    router.get("/assignee/:id", issues.findByAssignee);

    // Retrieve all issues involving a particular reportee
    router.get("/reportee/:id", issues.findByReportee);

    // Retrieve all children
    router.get("/:id/children", issues.findChildren);

    // Retrieve the parent
    router.get("/:id/parent", issues.findParent);

    // Retrieve a single issue with id
    router.get("/:id", issues.findOne);

    // Update a issue with id
    router.put("/:id", issues.update);

    // Delete a issue with id
    router.delete("/:id", issues.delete);

    // Delete all issue
    router.delete("/all", issues.deleteAll);

    app.use('/api/issues', router);
}