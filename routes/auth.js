const User = require("../models/User");
const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const JWT = "Login@userToken";

//creating user
Router.post(
  "/signin",
  [
    body("name", "Name length should be greater than 2").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password length be greater than 7").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let { name, password, email } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .send({ error: "sorry user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user = User({ name, email, password: hash });
      user.save();
      const data = {
        id: user.id,
      };
      const authToken = jwt.sign(data, JWT);
      res.send({ 
        code:0,
        message:"user is successfully signin",
        authToken:authToken,
        user:user
       });
    } catch (error) {
      res.status(500).send("Internal server Error");
    }
  }
);
Router.post(
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "password length be atleast 8 character").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let { password, email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .send({ error: "login with correct credentials" });
      }
      const passcheck = await bcrypt.compare(password, user.password);
      if (!passcheck) {
        return res
          .status(400)
          .send({ error: "login with correct credentials" });
      }
      const data = {
        id: user.id,
      };
      const authToken = jwt.sign(data, JWT);
      res.send({ 
        code:0,
        message:"user is successfully signin",
        authToken:authToken,
        user:user
       });
    } catch (error) {
      res.status(500).send("Internal server Error");
    }
  }
);

module.exports = Router;
