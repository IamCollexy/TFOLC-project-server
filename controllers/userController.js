const { response } = require('express');
const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcrypt');
// So we don't use too many try catch block
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

//@desc Get all users
// @route Get /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users?.length) {
    return res.status(400).json({
      message: 'No users found',
    });
  }
  res.json(users);
});

//@desc Create a user
// @route POST /users
// @access Private

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, email, roles } = req.body;
  // Confirm data
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: 'All fields are required' });
  }
  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' });
  }
  //Hash Password
  const hashedPassword = await bcrypt.hash(password, 10); //salt rounds

  const userObject = {
    username,
    password: hashedPassword,
    roles,
    email,
  };

  const user = await User.create(userObject);
  if (user) {
    res
      .status(201)
      .json({ message: `New User ${username} Created!` });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});

//@desc Update a user
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json({
      message:
        'All Fields are required, active status should be true or false',
    });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username })
      .lean()
      .exec();
    if (existingUser && existingUser?._id.toString() === id) {
      return res.status(400).json({
        message:
          'Username already exists. Please choose a different username.',
      });
    }

    const isValidUser = mongoose.Types.ObjectId.isValid(id);

    if (!isValidUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only update password if it is provided
    let update = { username, roles, active };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      update,
      { new: true } // Retrieve the updated document
    );

    res.json(`${user?.username} was updated`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//@desc Delete a user
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'User ID Required' });
  }

  const Services = await Service.findOne({ user: id }).lean().exec();

  if (Services) {
    return res
      .status(400)
      .json({ message: 'User has assigned Service' });
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const reply = `Username ${user.username} with ID ${user._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
