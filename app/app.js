const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const userRouter = require("./routes/users");

mongoose
  .connect(
    `mongodb+srv://
    ${process.env.MONGO_CLOUD_USR}:
    ${process.env.MONGO_CLOUD_PW}@
    ${process.env.MONGO_CLOUD_ID}.
    gcp.mongodb.net/databasename?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .catch(err => {
    console.log("Database connection error! " + err);
  });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", userRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
