require("dotenv").config(); //Use it to deal with Enviorment Variables
const authenticationServices = require("../Services/authenticationServices");
const bcrypt = require("bcryptjs");

module.exports.temporaryProfilePicUpload = async (req, res) => {
  try {
    const filePath =
      await authenticationServices.temporaryProfilePicUploadService(req.file);
    res.status(200).json({ filePath });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.signUp = async (req, res) => {
  try {
    console.log("SignUp Request Recieved In Backend");
    const newUser = await authenticationServices.signUpService(
      req.body,
      req.file
    );
    res.status(200).json({ message: "User created successfully", newUser });
  } catch {
    (error) => {
      console.log(error);
    };
  }
};

module.exports.logIn = async (req, res) => {
  console.log("Login Request Recieved In Backend");
  console.log(req.body, "controller");
  try {
    const userData = await authenticationServices.logInService(req.body);
    console.log(userData, "Controller");
    res.status(200).json({ message: "User LoggeIn successfully", userData });
  } catch (error) {
    // <-- Proper catch block
    console.log(error);
    res.status(500).json({ message: "Login failed", error });
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    await authenticationServices.logoutService(req);
    console.log("USer Successfully Logged Out", "Controller");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteAccount = async (req, res) => {
  try {
    const response = await authenticationServices.deleteAccountService(
      req.body.userId
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
