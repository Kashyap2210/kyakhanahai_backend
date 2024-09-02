const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* MODEL FOR THE USER STARTS*/
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  locality: { type: String, required: true },
  phone: { type: String },
  profilePic: { type: String },
  password: { type: String },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
