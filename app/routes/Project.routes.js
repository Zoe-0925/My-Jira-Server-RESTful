module.exports = app => {
   const projects = require("../controllers/Project.controller.js");
   var router = require("express").Router();



   // Create a new Project
   router.post("/", projects.create);

   // Retrieve all projects
   router.get("/", projects.findAll);

   // Retrieve all projects involving a particular user
   router.get("/projects/:userId", projects.findByUserId);

   // Retrieve a single project with id
   router.get("/:id", projects.findOne);

   // Update a project with id
   router.put("/:id", projects.update);

   // Delete a Project with id
   router.delete("/:id", projects.delete);

   // Delete all Project
   router.delete("/all", projects.deleteAll);

   // Delete all Projects of a particular leader
   router.delete("/lead/:id", projects.deleteByLeadId);

   // Delete a particular user inside the project member from a Project
   router.delete("/:id/members/:userId", projects.removeMember);

   app.use('/api/projects', router);
}