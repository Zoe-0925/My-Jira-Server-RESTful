module.exports = app => {
    const labels = require("../controllers/Label.controller.js");
    var router = require("express").Router();

    // Create a new label
    router.post("/", labels.create);

    // Retrieve all labels
    router.get("/", labels.findAll);

    // Retrieve all labels in a particular project
    router.get("/", labels.findByProject);

    // Retrieve all labels in a project
    router.get("/project/:id/", labels.findForProject);

    // Retrieve a single label with id
    router.get("/:id", labels.findOne);

    // Update a label with id
    router.put("/:id", labels.update);

    // Delete a label with id
    router.delete("/:id", labels.delete);

    // Delete all label
    router.delete("/all", labels.deleteAll);

    app.use('/api/labels', router);
}