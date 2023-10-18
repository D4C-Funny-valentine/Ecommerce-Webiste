const router = require("express").Router();
const ordersController = require("../controllers/ordersController"); /// change ordersController and change everything to order in here
const { verifyJwt, verifyAdmin } = require("../middleware/verifyJwt");

router.get("/orders", verifyAdmin, ordersController.getAllOrders);

router.post("/order", verifyJwt, ordersController.createOrderHandler);

router
  .route("/order/:id")
  .get(verifyAdmin, ordersController.getUserOrder)
  .put(verifyAdmin, ordersController.updateOrderHandler)
  .delete(verifyAdmin, ordersController.deleteOrderHandler);

// monthly income
router.get("/orders/income", verifyAdmin, ordersController.orderIncome);

module.exports = router;