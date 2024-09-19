const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const tutorialRouter = require(__dirname + "/routes/tutorialRoutes");
const userRouter = require(__dirname + "/routes/userRoutes");
const adminRouter = require(__dirname + "/routes/adminRoutes");
const errorController = require(__dirname + "/controllers/errorController");
const AppError = require(__dirname + "/utils/error");
const app = express();
var cookieParser = require("cookie-parser");
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
// app.use("/api", limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [],
  })
);
app.use(express.json({ limit: "10mb" }));
// app.use((req, res, next) => {
//   console.log(next);
//   next();
// });
app.use(helmet());
app.use(cookieParser());
app.use("/api/v1/tutorials", tutorialRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});
//universal error middleware
app.use(errorController);
module.exports = app;
