module.exports = app => {
  const reviews = require("../controllers/Review.controller.js");

  var router = require("express").Router();

  // Create a new Review
  router.post("/", reviews.create);

  // Retrieve all reviews
  router.get("/", reviews.findAll);

  // Retrieve all reviews of a particular product
  router.get("/product/:productId", reviews.findByProductId);

  // Retrieve a single Review with id
  router.get("/:id", reviews.findOne);

  // Update a Review with id
  router.put("/:id", reviews.update);

  // Delete a Review with id
  router.delete("/:id", reviews.delete);

  // Delete all Reviews
  router.delete("/", reviews.deleteAll);

  app.use('/api/reviews', router);
};