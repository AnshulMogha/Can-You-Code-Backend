const mongoose = require("mongoose");
const tutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "tutorial must have a title"],
      unique: [true],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "tutorial must have description"],
    },
    active: {
      type: Boolean,
      default: false,
      select: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tutorialSchema.virtual("topics", {
  ref: "Topic",
  foreignField: "parent",
  localField: "_id",
});

// tutorialSchema.pre("save", function (next) {
//   // console.log(this.title);
//   this.title = this.title.toLowerCase();
//   next();
// });
tutorialSchema.pre("findOneAndDelete", async function (next) {
  const tutorialId = this.getQuery()._id;
  await mongoose.model("Topic").deleteMany({ parent: tutorialId });
  next();
});

const Tutorial = mongoose.model("Tutorial", tutorialSchema);

module.exports = Tutorial;
