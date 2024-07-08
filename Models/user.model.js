const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcript = require("bcrypt");
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcript.genSalt(10);
    const hashedPassword = await bcript.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcript.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
