const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    ...data,
    password: hashedPassword,
  });
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

const updateUser = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await User.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  ).select("-password");
};

const deleteUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await User.findByIdAndDelete(id);
};

const logoutUser = async () => {
  return { message: "Logout successful. Delete your token on client side." };
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  logoutUser,
};
