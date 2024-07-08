const express = require("express");
const router = express.Router();
const createHttpError = require("http-errors");
const User = require("../Models/user.model");
const { authSchema } = require("../heplers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verfiyAccessToken,
} = require("../heplers/jwt_helper");
router.post("/register", async (req, res, next) => {
  try {
    const results = await authSchema.validateAsync(req.body);
    const doesExist = await User.findOne({ email: results.email });
    if (doesExist)
      throw createHttpError.Conflict(`${results.email} is alread registered`);
    const user = new User(results);
    const saveduser = await user.save();
    const accessToken = await signAccessToken(saveduser.id);
    const refreshToken = await signRefreshToken(saveduser.id);
    res.send({ accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createHttpError.NotFound(`User not registerd`);
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw createHttpError.Unauthorized("username or password not valid");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(createHttpError.BadRequest("invalid email or password"));
    next(error);
  }
});
router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError.BadRequest();
    const userId = await verfiyAccessToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({ accessToken: accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
});
router.delete("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError.BadRequest();
  } catch (error) {}
});
module.exports = router;
