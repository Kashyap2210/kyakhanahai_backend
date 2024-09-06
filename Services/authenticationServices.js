const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const Dish = require("../Models/dish.js");

module.exports.temporaryProfilePicUploadService = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }
  return `/upload/${file.filename}`;
};

module.exports.signUpService = async (userData, file) => {
  try {
    const { email, password, name, address, phone, locality } = userData;
    const profilePic = file ? file.path : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already registered");
    }

    const newUser = new User({
      email,
      name,
      address,
      locality,
      phone,
      profilePic,
      password,
    });

    await newUser.save();
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

module.exports.logInService = async (userData) => {
  console.log(userData, "Service");
  try {
    const { username, password } = userData;
    console.log(username);

    const logInUser = await User.findOne({ email: username });
    if (!logInUser) {
      return { success: false, message: "No User Found" };
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      logInUser.password
    ); // Compare password
    if (!isPasswordCorrect) {
      return { success: false, message: "Invalid Password" }; // Handle invalid password
    }

    const payload = {
      userId: logInUser._id, // Correctly accessing userId from logInUser
      email: logInUser.email, // Correctly accessing email from logInUser
    };

    console.log("This is the login user id in services", logInUser._id);
    console.log("This is the login user id in services", logInUser.email);

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    return { success: true, token, logInUser };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.logoutService = async (req) => {
  // res.clearCookie("jwtToken"); // Adjust this if you use a different cookie name
  console.log("JWT TOken Destroyed", "Service");
  return { message: "Logout successful" };
};

module.exports.deleteAccountService = async (userId) => {
  const userToBeDeleted = await User.findById(userId);
  if (!userToBeDeleted) {
    throw new Error("User not found");
  }
  await User.findByIdAndDelete(userId);
  await UpdatedDish.deleteMany({ userId: userId });
  return { message: "User Deleted" };
};
