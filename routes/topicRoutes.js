const router = require("express").Router({ mergeParams: true });
const topicController = require(__dirname + "/../controllers/topicController");
const authController = require(__dirname + "/../controllers/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    topicController.createTopic
  );
router
  .route("/:topId")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    topicController.updateTopic
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    topicController.deleteTopic
  );
module.exports = router;
