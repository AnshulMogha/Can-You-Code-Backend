const router = require("express").Router();
const authController = require(__dirname + "/../controllers/authController");
// const userController = require(__dirname + "/../controllers/userController");
const tutorialController = require(__dirname +
  "/../controllers/tutorialController");
router.get(
  "/tutorials",
  authController.protect,
  tutorialController.getAllAdminTutorials
);
module.exports = router;
