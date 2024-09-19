const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "User must have a name"],
  },
  email: {
    type: String,
    require: [true, "User must have a email address"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: [true, "User must have a password"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "dumadmin"],
    default: "user",
  },
  passwordChangedAt: Date,
});
userSchema.pre("save", async function (next) {
  try {
    // Check if the password field is modified
    if (!this.isModified("password")) {
      return next();
    }

    // Generate a hash
    const hashedPassword = await bcrypt.hash(this.password, 10);

    // Replace the plain text password with the hashed password
    this.password = hashedPassword;

    next();
  } catch (err) {
    next(err);
  }
});
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
};
module.exports = mongoose.model("User", userSchema);
