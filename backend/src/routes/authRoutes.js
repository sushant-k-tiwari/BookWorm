import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const routes = express.Router();

//generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

//Register and Login Routes with POST
routes.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //checks on fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (username.length < 3 || username.length > 20) {
      return res
        .status(400)
        .json({ message: "Username must be between 3 to 20 characters" });
    }

    //check if user already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //getting a random avatar from dicebear
    const profileImage = `https://avatar.iran.liara.run/public`;

    //creating new user
    const newUser = new User({
      username,
      email,
      password,
      profileImage,
    });

    //saving new user
    await newUser.save();

    //generating token
    const token = generateToken(newUser._id);
    res
      .status(201)
      .json({ message: "User created successfully", data: newUser, token });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});
routes.post("/login", (req, res) => {
  res.send("Login User");
});

export default routes;
