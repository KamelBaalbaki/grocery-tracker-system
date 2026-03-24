const request = require("supertest");
const app = require("../../src/app");

const itemService = require("../../src/services/item.service");
const redis = require("../../src/config/redis");
const {
  publishItemCreated,
  publishItemExpired
} = require("../../src/events/publishNotificationEvent");

// Mock Dependencies
jest.mock("../../src/services/item.service");
jest.mock("../../src/config/redis");
jest.mock("../../src/events/publishNotificationEvent");

describe("Item API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Create Item
  it("POST /api/items - should create item (no expiry)", async () => {
    itemService.createItem.mockResolvedValue({
      _id: "1",
      name: "Milk"
    });

    const res = await request(app)
      .post("/api/items")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ name: "Milk" });

    expect(res.statusCode).toBe(201);
    expect(publishItemCreated).toHaveBeenCalled();
  });

  it("POST /api/items - should create expired item immediately", async () => {
    const pastDate = new Date(Date.now() - 1000);

    itemService.createItem.mockResolvedValue({
      _id: "1",
      expiryDate: pastDate
    });

    itemService.markItemAsExpired.mockResolvedValue({
      _id: "1",
      status: "Expired"
    });

    const res = await request(app)
      .post("/api/items")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ name: "Milk", expiryDate: pastDate });

    expect(res.statusCode).toBe(201);
    expect(publishItemExpired).toHaveBeenCalled();
  });

  it("POST /api/items - should schedule future expiry", async () => {
    const futureDate = new Date(Date.now() + 100000);

    itemService.createItem.mockResolvedValue({
      _id: "1",
      expiryDate: futureDate
    });

    redis.zAdd.mockResolvedValue();

    const res = await request(app)
      .post("/api/items")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ name: "Milk", expiryDate: futureDate });

    expect(res.statusCode).toBe(201);
    expect(redis.zAdd).toHaveBeenCalled();
  });

  // Get Items
  it("GET /api/items - should return user items", async () => {
    itemService.getUserItems.mockResolvedValue([
      { name: "Milk" }
    ]);

    const res = await request(app)
      .get("/api/items")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  // Update Item
  it("PUT /api/items/:id - should update item", async () => {
    itemService.updateItem.mockResolvedValue({
      _id: "1",
      name: "Updated"
    });

    const res = await request(app)
      .put("/api/items/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ name: "Updated" });

    expect(res.statusCode).toBe(200);
  });

  it("PUT /api/items/:id - should fail invalid id", async () => {
    const res = await request(app)
      .put("/api/items/invalid-id")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com")
      .send({ name: "Updated" });

    expect(res.statusCode).toBe(404);
  });

  // Delete Item 
  it("DELETE /api/items/:id - should delete item", async () => {
    itemService.deleteItem.mockResolvedValue({ _id: "1" });
    redis.zRem.mockResolvedValue();

    const res = await request(app)
      .delete("/api/items/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(200);
    expect(redis.zRem).toHaveBeenCalled();
  });

  it("DELETE /api/items/:id - should return 404 if not found", async () => {
    itemService.deleteItem.mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/items/507f1f77bcf86cd799439011")
      .set("x-user-id", "123")
      .set("x-user-email", "kamel@test.com");

    expect(res.statusCode).toBe(404);
  });

});