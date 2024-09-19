const router = require("express").Router();
const topicRouter = require(__dirname + "/../routes/topicRoutes");
const tutorialController = require(__dirname +
  "/../controllers/tutorialController");
const authController = require(__dirname + "/../controllers/authController");
router.use("/:tutId/topics", topicRouter);

router
  .route("/")
  .get(authController.protect, tutorialController.getAllUserTutorials)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    tutorialController.createTutorial
  );
router
  .route("/:identifier")
  .get(authController.protect, tutorialController.getTutorial)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    tutorialController.updateTutorial
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tutorialController.deleteTutorial
  );
router.patch(
  "/:id/publish",
  authController.protect,
  authController.restrictTo("admin"),
  tutorialController.publish
);
router.patch(
  "/:id/unpublish",
  authController.protect,
  authController.restrictTo("admin"),
  tutorialController.unpublish
);
module.exports = router;
