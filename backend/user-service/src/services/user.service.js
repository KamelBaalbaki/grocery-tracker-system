const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
  return await User.findById(id);
};

const updateUser = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await User.findByIdAndUpdate(id, { $set: data }, { new: true }).select(
    "-password",
  );
};

const setResetPasswordToken = async (email, hashedToken, expiresAt) => {
  return await User.findOneAndUpdate(
    { email },
    {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiresAt,
    },
    { new: true },
  );
};

const findUserByResetToken = async (hashedToken) => {
  return await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

const resetUserPassword = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  return await user.save();
};

const setEmailVerificationToken = async (
  user,
  expiresInMs = 24 * 60 * 60 * 1000,
) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + expiresInMs;

  await user.save();

  return verificationToken;
};

const findUserByVerificationToken = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  return await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });
};

const verifyUserEmail = async (user) => {
  if (user.emailVerificationExpires < Date.now()) {
    if (user.pendingEmail) {
      user.pendingEmail = undefined;
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    throw new Error("Verification link expired. Please request a new one.");
  }

  if (user.pendingEmail) {
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  return await user.save();
};

const requestEmailChange = async (id, newEmail, password) => {
  const user = await User.findById(id);
  if (!user) return null;

  const existing = await User.findOne({ email: newEmail });
  if (existing) {
    throw new Error("Email already in use");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid password");
  }

  user.pendingEmail = newEmail;
  const verificationToken = await setEmailVerificationToken(user);

  await user.save();

  return { user, verificationToken };
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
  setResetPasswordToken,
  findUserByResetToken,
  resetUserPassword,
  setEmailVerificationToken,
  findUserByVerificationToken,
  verifyUserEmail,
  requestEmailChange,
  deleteUser,
  logoutUser,
};
