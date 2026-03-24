const request = require("supertest");
const app = require("../../src/app");

const recipeService = require("../../src/services/recipe.service");

// Mock service
jest.mock("../../src/services/recipe.service");

describe("Recipe API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Find By Ingredients
  it("POST /api/recipes/search - should return recipes", async () => {
    recipeService.findByIngredients.mockResolvedValue([
      { title: "Pasta" }
    ]);

    const res = await request(app)
      .post("/api/recipes/suggestions")
      .send({
        items: ["tomato", "pasta"],
        limit: 5
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(recipeService.findByIngredients).toHaveBeenCalledWith(
      ["tomato", "pasta"],
      5
    );
  });

  it("POST /api/recipes/suggestions - should fail if no items", async () => {
    const res = await request(app)
      .post("/api/recipes/suggestions")
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("POST /api/recipes/suggestions - should fail if items empty", async () => {
    const res = await request(app)
      .post("/api/recipes/suggestions")
      .send({ items: [] });

    expect(res.statusCode).toBe(400);
  });

  // Get Details
  it("GET /api/recipes/:id - should return recipe details", async () => {
    recipeService.getRecipeDetails.mockResolvedValue({
      id: "123",
      title: "Pizza"
    });

    const res = await request(app)
      .get("/api/recipes/123");

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Pizza");
    expect(recipeService.getRecipeDetails).toHaveBeenCalledWith("123");
  });

});