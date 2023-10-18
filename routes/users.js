const router = require("express").Router();
const usersController = require("../controllers/usersController");
const {
  verifyOwnershipOrAdmin,
  verifyAdmin,
} = require("../middleware/verifyJwt");

// get all user and search and limit
router.get("/users", verifyAdmin, usersController.getAllUsers);

// Get detail, update and delete
router
  .route("/user/:id")
  .get(verifyOwnershipOrAdmin, usersController.getUser)
  .put(verifyOwnershipOrAdmin, usersController.updateUserHandler)
  .delete(verifyOwnershipOrAdmin, usersController.deleteUserHandler);

// check user station per month (how many user register per month)
router.get("/users/stat", verifyAdmin, usersController.userAggregate);

module.exports = router;