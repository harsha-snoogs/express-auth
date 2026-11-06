const express = require("express");
const userModel = require("../data/user");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail =
      email != undefined && typeof email === "string"
        ? email.trim().toLowerCase()
        : email;

    if (
      name === undefined ||
      typeof name != "string" ||
      normalizedEmail === undefined ||
      typeof normalizedEmail != "string" ||
      password === undefined ||
      typeof password != "string" ||
      name.trim() === "" ||
      normalizedEmail === "" ||
      password.trim() === ""
    ) {
      res.status(400).json({
        message: "Invalid email, name, and password",
      });
      return;
    }
    const emailFound = await userModel.findOne({ email: normalizedEmail });

    if (emailFound) {
      res.status(409).json({
        message: "Email Already exisits",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser = await userModel.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
    console.log(newUser);

    res.status(201).json({
      message: "User added succecssfully",
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail =
      email != undefined && typeof email === "string"
        ? email.trim().toLowerCase()
        : email;

    if (
      typeof normalizedEmail != "string" ||
      normalizedEmail === undefined ||
      typeof password != "string" ||
      password === undefined ||
      normalizedEmail === "" ||
      password.trim() === ""
    ) {
      res.status(400).json({
        message: "Invalid email, name, and password",
      });
      return;
    }
    const filteredemail = await userModel.findOne({ email: normalizedEmail });
    console.log(filteredemail);
    if (!filteredemail) {
      res.status(401).json({
        message: "Invalid email and password",
      });
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      filteredemail.password,
    );

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email and password",
      });
      return;
    }
    let jwtpayload = {
      name: filteredemail.name,
      email: filteredemail.email,
      role: filteredemail.role,
      id: filteredemail._id.toString(),
    };
    let token = jwt.sign(jwtpayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Logged in successfully !!!",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
