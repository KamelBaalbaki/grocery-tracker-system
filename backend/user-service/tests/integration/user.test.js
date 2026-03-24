const request = require("supertest");
const app = require("../../src/app");

const userService = require("../../src/services/user.service");
const bcrypt = require("bcryptjs");

// Mock dependencies
jest.mock("../../src/services/user.service");
jest.mock("bcryptjs");

describe("User API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Get Me
  it("GET /api/users/me - should return current user", async () => {
    userService.getUserById.mockResolvedValue({
      _id: "123",
      email: "kamel@test.com"
    });

    const res = await request(app)
      .get("/api/users/me")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("kamel@test.com");
  });

  it("GET /api/users/me - should return 404 if user not found", async () => {
    userService.getUserById.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/users/me")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

  // Update User
  it("PUT /api/users/:id - should update user", async () => {
    userService.updateUser.mockResolvedValue({
      _id: "123",
      firstName: "Updated"
    });

    const res = await request(app)
      .put("/api/users/123")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ firstName: "Updated" });

    expect(res.statusCode).toBe(200);
  });

  // Change Password
  it("PUT /api/users/password - should change password", async () => {
    const mockUser = {
      password: "hashed",
      save: jest.fn()
    };

    userService.getUserById.mockResolvedValue(mockUser);

    bcrypt.compare
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    bcrypt.hash.mockResolvedValue("newHashed");

    const res = await request(app)
      .put("/api/users/password")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({
        oldPassword: "OldPass123!",
        newPassword: "NewPass123!"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password updated successfully");
  });

  it("PUT /api/users/password - should fail if old password incorrect", async () => {
    userService.getUserById.mockResolvedValue({
      password: "hashed"
    });

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .put("/api/users/password")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({
        oldPassword: "wrong",
        newPassword: "NewPass123!"
      });

    expect(res.statusCode).toBe(400);
  });

  it("PUT /api/users/password - should fail if weak password", async () => {
    userService.getUserById.mockResolvedValue({
      password: "hashed"
    });

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .put("/api/users/password")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({
        oldPassword: "OldPass123!",
        newPassword: "short"
      });

    expect(res.statusCode).toBe(400);
  });

  // Delete User
  it("DELETE /api/users/:id - should delete user", async () => {
    userService.deleteUser.mockResolvedValue({ _id: "123" });

    const res = await request(app)
      .delete("/api/users/123")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/users/:id - should return 404 if not found", async () => {
    userService.deleteUser.mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/users/123")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

  // Logout
  it("POST /api/users/logout - should logout user", async () => {
    userService.logoutUser.mockResolvedValue({
      message: "Logout successful"
    });

    const res = await request(app)
      .post("/api/users/logout")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
  });
});