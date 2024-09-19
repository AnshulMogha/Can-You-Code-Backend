const router = require("express").Router();
const authController = require(__dirname + "/../controllers/authController");
const userController = require(__dirname + "/../controllers/userController");
router.post("/signup", userController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/auth", authController.userAuthStatus);
module.exports = router;
