const mongoose = require("mongoose");
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "topic must have a title"],
  },
  description: {
    type: String,
  },
  images: String,
  parent: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
});
topicSchema.pre("save", function (next) {
  this.title = this.title.toLowerCase();
  next();
});
topicSchema.index({ title: 1, parent: 1 }, { unique: true });
module.exports = mongoose.model("Topic", topicSchema);
