const router = require("express").Router();
const cartsController = require("../controllers/cartsController");
const {
  verifyJwt,
  verifyAdmin,
  verifyOwnershipOrAdmin,
} = require("../middleware/verifyJwt");

router.get("/carts", verifyAdmin, cartsController.getAllCarts);

router.post("/cart", verifyJwt, cartsController.createCartHandler);

router
  .route("/cart/:id")
  .get(verifyOwnershipOrAdmin, cartsController.getUserCart)
  .put(verifyOwnershipOrAdmin, cartsController.updateCartHandler)
  .delete(verifyOwnershipOrAdmin, cartsController.deleteCartHandler);

module.exports = router;
