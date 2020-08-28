const passport = require('passport')

module.exports = app => {
    const users = require("../controllers/User.controller.js");
    var router = require("express").Router();

    // Create a new user => Only used for testing and mock data
    router.post("/", users.create);

    router.post("/login", users.login);

    router.post("/login/github", passport.authenticate('github'));

    router.get('/auth/github/callback', users.gitHubLogin);

    router.post('/logout', users.logOut);

    // Retrieve all users
    router.get("/", users.findAll);

    router.post("/signup", users.register);

    // Update a user's name and email with id
    router.post("/update-info", users.update);

    // Update a user's name and email with id
    router.post("/update-email", users.updateEmail);

    // Update a user's name and email with id
    router.post("/update-password", users.updatePassword);

    // Delete a user with id
    router.delete("/:id", users.delete);

    // Delete all user
    router.delete("/all", users.deleteAll);

    app.use('/api/users', router);
}