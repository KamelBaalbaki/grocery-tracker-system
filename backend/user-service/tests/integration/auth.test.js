const request = require("supertest");
const app = require("../../src/app");

const userService = require("../../src/services/user.service");
const bcrypt = require("bcryptjs");
const generateToken = require("../../src/utils/jwt");
const sendEmail = require("../../src/utils/email.service");
const crypto = require("crypto");

// Mock dependencies
jest.mock("../../src/services/user.service");
jest.mock("bcryptjs");
jest.mock("../../src/utils/jwt");
jest.mock("../../src/utils/email.service");

describe("Auth API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Register
  it("should register a user", async () => {
    userService.findUserByEmail.mockResolvedValue(null);

    userService.createUser.mockResolvedValue({
      _id: "123",
      firstName: "Kamel",
      lastName: "B",
      email: "kamel@test.com"
    });

    generateToken.mockReturnValue("fake-token");

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Kamel",
        lastName: "B",
        email: "kamel@test.com",
        password: "Password123!"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBe("fake-token");
  });

  it("should fail if user exists", async () => {
    userService.findUserByEmail.mockResolvedValue({
      email: "kamel@test.com"
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Kamel",
        lastName: "B",
        email: "kamel@test.com",
        password: "Password123!"
      });

    expect(res.statusCode).toBe(400);
  });

  // Login
  it("should login successfully", async () => {
    userService.findUserByEmail.mockResolvedValue({
      _id: "123",
      email: "kamel@test.com",
      password: "hashed"
    });

    bcrypt.compare.mockResolvedValue(true);
    generateToken.mockReturnValue("token");

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "kamel@test.com",
        password: "Password123!"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("token");
  });

  it("should fail if password is wrong", async () => {
    userService.findUserByEmail.mockResolvedValue({
      password: "hashed"
    });

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "kamel@test.com",
        password: "wrong"
      });

    expect(res.statusCode).toBe(401);
  });

  // Forgot Password
  it("should send reset email if user exists", async () => {
    userService.findUserByEmail.mockResolvedValue({
      _id: "123",
      email: "kamel@test.com",
    });

    userService.setResetPasswordToken = jest.fn();

    jest.spyOn(crypto, "randomBytes").mockReturnValue({
      toString: () => "resettoken123",
    });

    sendEmail.mockResolvedValue(true);

    const res = await request(app).post("/api/auth/forgot-password").send({
      email: "kamel@test.com",
    });

    expect(res.statusCode).toBe(200);
    expect(userService.setResetPasswordToken).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
  });

  it("should return success message even if user does not exist", async () => {
    userService.findUserByEmail.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/forgot-password").send({
      email: "notfound@test.com",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User with this email does not exist");
    expect(sendEmail).not.toHaveBeenCalled();
    expect(userService.setResetPasswordToken).not.toHaveBeenCalled();
  });

  // Reset Password
  it("should reset password successfully", async () => {
    const token = "resettoken123";

    userService.findUserByResetToken.mockResolvedValue({
      _id: "123",
      email: "kamel@test.com",
    });

    userService.resetUserPassword.mockResolvedValue(true);

    const res = await request(app)
      .post(`/api/auth/reset-password/${token}`)
      .send({
        password: "NewPassword123!",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password reset successful");
  });

  it("should fail if token is invalid or expired", async () => {
    userService.findUserByResetToken.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/reset-password/invalidtoken")
      .send({
        password: "NewPassword123!",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Token invalid or expired");
  });

  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password/sometoken")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Password is required");
  });
});