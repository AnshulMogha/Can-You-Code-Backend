class AppError extends Error {
  constructor(errorCode, errorMessage) {
    super(errorMessage);
    this.statusCode = errorCode;
    this.status = `${errorCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = AppError;
