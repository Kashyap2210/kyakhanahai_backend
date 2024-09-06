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

    const existingUserInstance1 = await User.findOne({ email });
    if (existingUserInstance1) {
      return { success: false, message: "User already registered" };
    }

    const userWithSamePhone = await User.find({ phone });
    if (userWithSamePhone.length >= 3) {
      return {
        success: false,
        message: "Only 3 Accounts Can Be Registered Per Phone Number",
      };
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
    return { success: true, message: "User Created Successfully", newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
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
