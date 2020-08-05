module.exports = app => {
    const status = require("../controllers/Status.controller.js");
    var router = require("express").Router();

    // Create a new status
    router.post("/", status.create);

    // Retrieve all status
    router.get("/", status.findAll);

    // Retrieve all status in a particular project
    router.get("/", status.findByProject);

    // Retrieve all status in a project
    router.get("/project/:id/", status.findForProject);

    // Retrieve a single status with id
    router.get("/:id", status.findOne);

    // Update a status with id
    router.put("/:id", status.update);

    // Delete a status with id
    router.delete("/:id", status.delete);

    // Delete all status
    router.delete("/all", status.deleteAll);

    app.use('/api/status', router);
}