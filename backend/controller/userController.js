const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Links = require("../models/linkModel");
const generateToken = require("../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Bad request" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(409).json({ message: "User already exists, please login" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to register new user" });
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    res.status(401).json({ message: "User email or password" });
  }
});

const getAllUser = expressAsyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  const userId = req.params.userId; // Make sure you use 'userId' here

  // Ensure the user ID is valid
  console.log("Deleting user with ID:", userId);

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Log user deletion step
  console.log("User found:", user);

  // Delete the user
  await User.deleteOne({ _id: userId });
  console.log("User deleted successfully.");

  // Delete the associated links created by this user
  await Links.deleteMany({ createdBy: userId });
  console.log("Links associated with the user deleted.");

  // Respond with success
  res
    .status(200)
    .json({ message: "User and associated links deleted successfully" });
});
module.exports = { registerUser, loginUser, getAllUser, deleteUser };
