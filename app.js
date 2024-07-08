const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./heplers/init_mongo_db");
const AuthRoute = require("./Routes/auth.route");
const { verfiyAccessToken } = require("./heplers/jwt_helper");
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verfiyAccessToken, async (req, res, next) => {
  res.send("hello from express");
});
app.use("/auth", AuthRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server running");
});
