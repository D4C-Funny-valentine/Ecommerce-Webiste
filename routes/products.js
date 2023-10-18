const router = require("express").Router();
const productsController = require("../controllers/productsController");
const { verifyJwt, verifyAdmin } = require("../middleware/verifyJwt");

// get all products and search and filter category
router.get("/products", productsController.getAllProducts);

router.post("/product", verifyJwt, productsController.createProductHandler);

router
  .route("/product/:id")
  .get(productsController.getProduct)
  .put(verifyJwt, productsController.updateProductHandler)
  .delete(verifyAdmin, productsController.deleteProductHandler);

module.exports = router;