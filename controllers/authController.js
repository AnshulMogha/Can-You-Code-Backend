const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const catchError = require(__dirname + "/../utils/catchError");
const AppError = require(__dirname + "/../utils/error");
const userModel = require(__dirname + "/../models/userModel");
const createAndSendToken = function (user, res) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookiesOption = {
    sameSite: "strict",
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookiesOption.secure = true;

  res.cookie("jwt", token, cookiesOption);
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
exports.createAndSendToken = createAndSendToken;

exports.protect = catchError(async function (req, res, next) {
  let { jwt: token } = req.cookies;
  //no Token but get request to tutorials

  if (!token && req.method === "GET" && req.baseUrl === "/api/v1/tutorials") {
    req.user = { role: "user" };
    return next();
  }
  //no token request is diffrent or path is diffrent
  if (!token)
    return next(new AppError(401, "Your are not login please login first"));

  //verifying token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  //checking user
  const user = await userModel.findById(decoded.id);
  if (!user) next(new AppError(401, "User Not exist"));

  // user exist but pawword maybe changed and user using old token
  //continue from here

  if (user.changePasswordAfter(decoded.iat))
    return next(new AppError(401, "Password changed please login again"));
  req.user = user;

  next();
});

exports.userAuthStatus = catchError(async function (req, res) {
  const resObj = {
    status: "success",
    data: {
      isAuthenticated: false,
      user: null,
    },
  };
  let { jwt: token } = req.cookies;

  if (!token) return res.status(200).json(resObj);

  //verifying token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  //checking user
  const user = await userModel.findById(decoded.id);
  if (!user) return res.status(200).json(resObj);

  // user exist but pawword maybe changed and user using old token
  //continue from here

  if (user.changePasswordAfter(decoded.iat))
    return res.status(200).json(resObj);
  resObj.data.isAuthenticated = true;
  resObj.data.user = user;
  res.status(200).json(resObj);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "You do not have permission to perform this action")
      );
    }

    next();
  };
};

exports.login = catchError(async function (req, res) {
  const { email, password } = req.body;
  const currentUser = await userModel.findOne({ email }).select("+password");
  if (!currentUser || !(await bcrypt.compare(password, currentUser.password)))
    throw new AppError(401, "Incorrect username or password");
  createAndSendToken(currentUser, res);
});
exports.logout = catchError(async function (req, res) {
  const cookiesOption = {
    sameSite: "Strict",
    expires: new Date(Date.now() + 1000 * 60),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookiesOption.secure = true;

  res.cookie("jwt", "", cookiesOption);
  res.status(200).json({
    status: "success",
    data: {
      user: null,
    },
  });
});
