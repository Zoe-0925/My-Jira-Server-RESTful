module.exports = app => {
    const users = require("../controllers/User.controller.js");
    var router = require("express").Router();

    // Create a new user => Only used for testing and mock data
    router.post("/", users.create);

    router.post("/login", users.login);

    //TODO
    //check req.logout()
    router.post('/logout', (req, res) => {
        //TODO change to get token.
        req.logout();
        //The server clears the state
        //TODO the client redirects...
        // res.redirect('/login');
    });

    // Retrieve all users
    router.get("/", users.findAll);

    // Retrieve a single user with id
    router.get("/:id", users.findOne);

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