const mongoose = require("mongoose");
const tutorialModel = require(__dirname + "/../models/tutorialModel");
const topicModel = require(__dirname + "/../models/topicModel");
const catchError = require(__dirname + "/../utils/catchError");
const AppError = require(__dirname + "/../utils/error");
//get all tutorial
exports.getAllUserTutorials = catchError(async (req, res) => {
  // console.log(req);
  const tutorials = await tutorialModel.find({ active: true });

  // console.log(data);

  res.status(200).json({
    status: "success",
    data: {
      tutorials,
    },
  });
});
exports.getAllAdminTutorials = catchError(async (req, res) => {
  // console.log(req);
  let tutorials;
  if (req.user.role === "admin")
    tutorials = await tutorialModel.find().select("+active");

  // console.log(data);

  res.status(200).json({
    status: "success",
    data: {
      tutorials,
    },
  });
});

exports.getTutorial = catchError(async (req, res) => {
  let tutorial;
  if (!mongoose.isValidObjectId(req.params.identifier)) {
    if (req.user.role === "admin")
      tutorial = await tutorialModel
        .findOne({ title: req.params.identifier })
        .select("+active")
        .populate("topics");
    else
      tutorial = await tutorialModel
        .findOne({ title: req.params.identifier, active: true })
        .populate("topics");
  } else if (req.user.role === "admin")
    tutorial = await tutorialModel
      .findById(req.params.identifier)
      .select("+active")
      .populate("topics");
  else
    tutorial = await tutorialModel
      .findOne({ _id: req.params.identifier, active: true })
      .populate("topics");

  if (!tutorial)
    throw new AppError(404, "Can't find any tutorial with given id or title!");
  res.status(200).json({
    status: "success",
    data: {
      tutorial,
    },
  });
});
exports.createTutorial = catchError(async (req, res) => {
  if (req.body.topics)
    throw new AppError(400, "Not a valid request to create topics");
  const tutorial = await tutorialModel.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      tutorial,
    },
  });
});
exports.updateTutorial = catchError(async (req, res) => {
  if (req.body.topics)
    throw new AppError(400, "Not a valid request to Update topics");

  let tutorial = await tutorialModel.findById(req.params.identifier);

  if (!tutorial)
    throw new AppError(404, "Can't find any tutorial with given id !");

  Object.assign(tutorial, req.body);
  tutorial = await tutorial.save();
  res.status(200).json({
    status: "success",
    data: {
      tutorial,
    },
  });
});

exports.deleteTutorial = catchError(async (req, res) => {
  // Find and delete the tutorial by ID
  let tutorial = await tutorialModel.findByIdAndDelete(req.params.identifier);

  // If the tutorial is not found, throw an error
  if (!tutorial)
    throw new AppError(404, "Can't find any tutorial with given id!");

  // Delete all topics associated with the tutorial
  await topicModel.deleteMany({ parent: req.params.identifier });

  // Send a success response
  res.status(200).json({
    status: "success",
    data: {
      tutorial,
    },
  });
});

exports.publish = catchError(async (req, res) => {
  req.body = { active: true };
  this.updateTutorial(req, res);
});
exports.unpublish = catchError(async (req, res) => {
  req.body = { active: false };
  this.updateTutorial(req, res);
});
