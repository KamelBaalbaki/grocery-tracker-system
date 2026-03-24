const request = require("supertest");
const app = require("../../src/app");

const userService = require("../../src/services/user.service");
const bcrypt = require("bcryptjs");
const generateToken = require("../../src/utils/jwt");

// Mock dependencies
jest.mock("../../src/services/user.service");
jest.mock("bcryptjs");
jest.mock("../../src/utils/jwt");

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
});