module.exports = app => {
    const users = require("../controllers/User.controller.js");
    var router = require("express").Router();

    // Create a new user
    router.post("/", users.create);

    // Add a project
    router.post("/:id/projects", users.addProject);

    // Retrieve all users
    router.get("/", users.findAll);

    // Retrieve a single user with id
    router.get("/:id", users.findOne);

    // Retrieve a single user with email
    router.get("/email/:email", users.findOneByEmail);

    // Retrieve a single user with email
    router.get("/checkEmail/:email", users.checkEmailExist);

    // Update a user's name and email with id
    router.put("/info/:id", users.update);

    // Update a user's name and email with id
    router.put("/email/:id", users.updateEmail);

    // Update a user's name and email with id
    router.put("/password/:id", users.updatePassword);

    // Delete a user with id
    router.delete("/:id", users.delete);

    // Delete all user
    router.delete("/all", users.deleteAll);

    app.use('/api/users', router);
}