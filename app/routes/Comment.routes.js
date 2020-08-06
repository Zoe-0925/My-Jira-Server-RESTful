module.exports = app => {
    const comments = require("../controllers/Comment.controller.js");
    var router = require("express").Router();

    // Create a new Comment (Commenttype: Epic, Task or Subtask)
    router.post("/", comments.create);

    // Retrieve all comments
    router.get("/", comments.findAll);

    // Retrieve all comments in an issue
    router.get("/issue/:id/", comments.findForIssue); //sort by date

    // Retrieve all children
    router.get("/:id/children", comments.findChildren);

    // Retrieve a single comment with id
    router.get("/:id", comments.findOne);

    // Update a comment with id
    router.put("/:id", comments.update);

    // Delete a comment with id
    router.delete("/:id", comments.delete);

     // Delete all comments
     router.delete("/all", comments.deleteAll);

    // Delete all comments of an issue
    router.delete("/issue/:id", comments.deleteByIssue);

    app.use('/api/comments', router);
}