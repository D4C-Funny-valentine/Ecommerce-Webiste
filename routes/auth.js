const router = require("express").Router();
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");

router.post("/register", registerController.registerHandler);

router.post("/login", loginController.loginHandler);

module.exports = router;
