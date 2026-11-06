const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../authorize");
const router = express.Router();

router.get("/profile", authenticate, (req, res, next) => {
  const { user } = req;
  console.log("Reached user");
  const fileterdUSerData = {
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
  };
  res.status(200).json({
    user: fileterdUSerData,
    message: "Profile data sent successfully",
  });
});

router.get("/admin", authenticate, authorize(["admin"]), (req, res, next) => {
  const { user } = req;
  console.log("Reached user");
  const fileterdUSerData = {
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
  };
  res.status(200).json({
    user: fileterdUSerData,
    message: "Profile data sent successfully",
  });
});

module.exports = router;
