// authenticationRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const isLoggedIn = require("../middleware.js"); // Ensure this is the correct path
const authenticationController = require("../Controllers/authenticationControllers");

router.post(
  "/upload",
  upload.single("profilePic"),
  authenticationController.temporaryProfilePicUpload
);

router.post(
  "/signup",
  upload.single("profilePic"),
  authenticationController.signUp
);

router.post("/login", authenticationController.logIn);

router.post(
  "/logout",
  isLoggedIn, //We will check this later with JWT Tokens
  authenticationController.logout
);

router.delete(
  "/deleteaccount",
  isLoggedIn,
  authenticationController.deleteAccount
);

module.exports = router;
