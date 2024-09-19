const topicModel = require(__dirname + "/../models/topicModel");
const catchError = require(__dirname + "/../utils/catchError");
const AppError = require(__dirname + "/../utils/error");

exports.createTopic = catchError(async (req, res) => {
  req.body.parent = req.params.tutId;
  const topic = await topicModel.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      topic,
    },
  });
});

exports.updateTopic = catchError(async (req, res) => {
  let topic = await topicModel.findById(req.params.topId);
  if (!topic || topic.parent != req.params.tutId)
    throw new AppError(
      404,
      "topic not found with given tutorial id and topic id:"
    );

  Object.assign(topic, req.body);
  topic = await topic.save();
  res.status(200).json({
    status: "success",
    data: {
      topic,
    },
  });
});
exports.deleteTopic = catchError(async (req, res) => {
  const tutorialId = req.params.tutId;
  const topicId = req.params.topId;

  const topic = await topicModel.findOneAndDelete({
    _id: topicId,
    parent: tutorialId,
  });
  if (!topic)
    throw new AppError(
      404,
      "topic not found with given tutorial id and topic id:"
    );
  res.status(200).json({
    status: "success",
    data: {
      topic,
    },
  });
});
