const request = require("supertest");
const app = require("../../src/app");

const notificationService = require("../../src/services/notification.service");

// Mock service
jest.mock("../../src/services/notification.service");

describe("Notification API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Create Notification
  it("POST /api/notifications - should create notification", async () => {
    notificationService.createNotification.mockResolvedValue({
      _id: "1",
      message: "Test notification"
    });

    const res = await request(app)
      .post("/api/notifications")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ message: "Test notification" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Test notification");
  });

  it("POST /api/notifications - should fail if body missing", async () => {
    const res = await request(app)
      .post("/api/notifications")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(400);
  });

  // Get Notifications
  it("GET /api/notifications - should get user notifications", async () => {
    notificationService.getUserNotifications.mockResolvedValue([
      { message: "Test" }
    ]);

    const res = await request(app)
      .get("/api/notifications")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  // Mark One As Read
  it("PUT /api/notifications/:id/read - should mark as read", async () => {
    notificationService.markNotificationAsRead.mockResolvedValue({
      _id: "1",
      read: true
    });

    const res = await request(app)
      .put("/api/notifications/507f1f77bcf86cd799439011/read")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
  });

  it("PUT /api/notifications/:id/read - invalid id", async () => {
    const res = await request(app)
      .put("/api/notifications/invalid-id/read")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

  it("PUT /api/notifications/:id/read - not found", async () => {
    notificationService.markNotificationAsRead.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/notifications/507f1f77bcf86cd799439011/read")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

  // Mark All As Read
  it("PUT /api/notifications/read-all - should mark all as read", async () => {
    notificationService.markAllNotificationsAsRead.mockResolvedValue({
      matchedCount: 2,
      modifiedCount: 2
    });

    const res = await request(app)
      .put("/api/notifications/read-all")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
    expect(res.body.updatedCount).toBe(2);
  });

  it("PUT /api/notifications/read-all - none to update", async () => {
    notificationService.markAllNotificationsAsRead.mockResolvedValue({
      matchedCount: 0,
      modifiedCount: 0
    });

    const res = await request(app)
      .put("/api/notifications/read-all")
      .set("x-user-id", "123")
      .set("x-user-email", "test@test.com");

    expect(res.statusCode).toBe(404);
  });

  // Delete Notification
  it("DELETE /api/notifications/:id - should delete notification", async () => {
    notificationService.deleteNotification.mockResolvedValue({ _id: "1" });

    const res = await request(app)
      .delete("/api/notifications/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/notifications/:id - invalid id", async () => {
    const res = await request(app)
      .delete("/api/notifications/invalid-id")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

  it("DELETE /api/notifications/:id - not found", async () => {
    notificationService.deleteNotification.mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/notifications/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

  // Delete All
  it("DELETE /api/notifications - should delete all notifications", async () => {
    notificationService.deleteAllNotifications.mockResolvedValue({});

    const res = await request(app)
      .delete("/api/notifications")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
  });
});