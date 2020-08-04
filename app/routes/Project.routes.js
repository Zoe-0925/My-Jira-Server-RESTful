module.exports = app => {
    const projects = require("../controllers/Project.controller.js");
    var router = require("express").Router();

    // Create a new Project
  //  router.post("/", projects.create);

    // Retrieve all projects
  //  router.get("/", projects.findAll);

    // Retrieve all projects involving a particular user
 //   router.get("/projects/:userId", projects.findByUserId);

    // Retrieve a single project with id
 //   router.get("/:id", projects.findOne);

    // Update a project with id
 //   router.put("/:id", projects.update);

    // Delete a Review with id
 //   router.delete("/:id", projects.delete);

    // Delete all Reviews
  //  router.delete("/", projects.deleteAll);

    app.use('/api/projects', router);
}