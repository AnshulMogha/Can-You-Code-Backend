const AppError = require(__dirname + "/../utils/error");
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400, message);
};
const handleCasteDBError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, message);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);
function sendDevelopmentError(error, res) {
  // console.log(error.stack);
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
}
function sendProductionError(err, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
}

//we are not using next parameneter but we don't remove this because
// if you remove next then it consider as a normal middleware

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  //if error not genrated by error class not a trusted error

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") sendDevelopmentError(err, res);
  else if (process.env.NODE_ENV === "production") {
    let error = { ...err }; //we dont want to modify original error
    error.message = err.message;
    error.name = err.name;
    console.log(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "CastError") error = handleCasteDBError(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendProductionError(error, res);
  }
};
