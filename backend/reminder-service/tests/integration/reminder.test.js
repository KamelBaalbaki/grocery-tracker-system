const request = require("supertest");
const app = require("../../src/app");

const reminderService = require("../../src/services/reminder.service");
const redis = require("../../src/config/redis");
const {
  publishReminderSet,
  publishReminderDue
} = require("../../src/events/publishReminderEvents");

// Mock dependencies
jest.mock("../../src/services/reminder.service");
jest.mock("../../src/config/redis");
jest.mock("../../src/events/publishReminderEvents");

describe("Reminder API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Create Reminder
  it("POST /api/reminders - should create reminder", async () => {
    const futureDate = new Date(Date.now() + 100000);

    reminderService.createReminder.mockResolvedValue({
      _id: "1",
      reminderDate: futureDate,
      itemName: "Milk"
    });

    redis.zAdd.mockResolvedValue();

    const res = await request(app)
      .post("/api/reminders")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({
        itemId: "507f1f77bcf86cd799439011",
        reminderDate: futureDate,
        itemName: "Milk"
      });

    expect(res.statusCode).toBe(201);
    expect(redis.zAdd).toHaveBeenCalled();
    expect(publishReminderSet).toHaveBeenCalled();
  });

  it("POST /api/reminders - should fail invalid itemId", async () => {
    const res = await request(app)
      .post("/api/reminders")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({
        itemId: "invalid-id",
        reminderDate: new Date(),
        itemName: "Milk"
      });

    expect(res.statusCode).toBe(400);
  });

  it("POST /api/reminders - should fail missing date", async () => {
    const res = await request(app)
      .post("/api/reminders")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({
        itemId: "507f1f77bcf86cd799439011",
        itemName: "Milk"
      });

    expect(res.statusCode).toBe(400);
  });

  // Get Reminders
  it("GET /api/reminders - should get reminders", async () => {
    reminderService.getUserReminders.mockResolvedValue([
      { itemName: "Milk" }
    ]);

    const res = await request(app)
      .get("/api/reminders")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  // Update Reminder
  it("PUT /api/reminders/:id - should update future reminder", async () => {
    const futureDate = new Date(Date.now() + 100000);

    const mockReminder = {
      _id: "1",
      reminderDate: futureDate,
      itemName: "Milk",
      save: jest.fn()
    };

    reminderService.updateReminder.mockResolvedValue(mockReminder);
    redis.zRem.mockResolvedValue();
    redis.zAdd.mockResolvedValue();

    const res = await request(app)
      .put("/api/reminders/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ itemName: "Updated Milk" });

    expect(res.statusCode).toBe(200);
    expect(redis.zAdd).toHaveBeenCalled();
    expect(publishReminderSet).toHaveBeenCalled();
  });

  it("PUT /api/reminders/:id - should trigger due reminder", async () => {
    const pastDate = new Date(Date.now() - 1000);

    const mockReminder = {
      _id: "1",
      reminderDate: pastDate,
      itemName: "Milk",
      save: jest.fn()
    };

    reminderService.updateReminder.mockResolvedValue(mockReminder);
    redis.zRem.mockResolvedValue();

    const res = await request(app)
      .put("/api/reminders/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ itemName: "Milk" });

    expect(res.statusCode).toBe(200);
    expect(publishReminderDue).toHaveBeenCalled();
  });

  it("PUT /api/reminders/:id - invalid id", async () => {
    const res = await request(app)
      .put("/api/reminders/invalid-id")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("PUT /api/reminders/:id - not found", async () => {
    reminderService.updateReminder.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/reminders/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ itemName: "Milk" });

    expect(res.statusCode).toBe(404);
  });

  // Delete Reminder
  it("DELETE /api/reminders/:id - should delete reminder", async () => {
    reminderService.deleteReminder.mockResolvedValue({ _id: "1" });
    redis.zRem.mockResolvedValue();

    const res = await request(app)
      .delete("/api/reminders/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "test@test.com");

    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/reminders/:id - invalid id", async () => {
    const res = await request(app)
      .delete("/api/reminders/invalid-id")
      .set("x-user-id", "123")
      .set("x-user-email", "test@test.com");

    expect(res.statusCode).toBe(400);
  });

  it("DELETE /api/reminders/:id - not found", async () => {
    reminderService.deleteReminder.mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/reminders/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

});