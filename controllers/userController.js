const userModel = require(__dirname + "/../models/userModel");
const catchError = require(__dirname + "/../utils/catchError");
const authController = require(__dirname + "/authController");
exports.signup = catchError(async (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  };
  const user = await userModel.create(newUser);
  authController.createAndSendToken(user, res);
});
