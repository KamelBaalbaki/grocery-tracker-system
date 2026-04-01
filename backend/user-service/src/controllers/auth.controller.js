const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");
const generateToken = require("../utils/jwt");
const crypto = require("crypto");
const sendEmail = require("../utils/email.service");
const resetPasswordEmail = require("../templates/resetPasswordEmail");

const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
    });

    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    res.status(201).json({
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
    });

    res.json({
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await userService.setResetPasswordToken(
      email,
      hashedToken,
      Date.now() + 10 * 60 * 1000,
    );

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      resetPasswordEmail({ resetURL }),
    );

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    if (!/[A-Z]/.test(password)) {
      return res
        .status(400)
        .json({
          message: "Password must contain at least one uppercase letter",
        });
    }
    if (!/[a-z]/.test(password)) {
      return res
        .status(400)
        .json({
          message: "Password must contain at least one lowercase letter",
        });
    }
    if (!/[0-9]/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must contain at least one number" });
    }
    if (!/[\W_]/.test(password)) {
      return res
        .status(400)
        .json({
          message: "Password must contain at least one special character",
        });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userService.findUserByResetToken(hashedToken);

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    await userService.resetUserPassword(user, password);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
