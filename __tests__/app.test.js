const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const expectedEndpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("Returns json object with info about all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toEqual(expectedEndpoints);
      });
  });
});
describe("GET /api/shops", () => {
  test("GET 200 responds with a status code 200 and array of objects wtih expected properties", () => {
    return request(app)
      .get("/api/shops")
      .expect(200)
      .then(({ body }) => {
        const { shops } = body;
        expect(shops.length).toBe(4);
        shops.forEach((shop) => {
          expect(typeof shop.shop_name).toBe("string");
          expect(typeof shop.address).toBe("string");
          expect(typeof shop.longitude).toBe("string");
          expect(typeof shop.latitude).toBe("string");
          expect(typeof shop.shop_type).toBe("string");
        });
      });
  });
});
describe("GET /api/invalid_endpoint", () => {
  test("GET: responds with a 404 status code and poplates a message 'endpoint not found' when provided the wrong endpoint", () => {
    return request(app)
      .get("/api/shopzzzzzzzz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("endpoint not found");
      });
  });
});
describe("GET /api/food", () => {
    test("GET 200 responds with a status code 200 and array of objects wtih expected properties for foods", () => {
      return request(app)
        .get("/api/food")
        .expect(200)
        .then(({ body }) => {
          const { foods } = body;
          expect(foods.length).toBe(5);
          foods.forEach((food) => {
            expect(typeof food.shop_id).toBe("number");
            expect(typeof food.item_name).toBe("string");
            expect(typeof food.quantity).toBe("number");
            expect(typeof food.item_description).toBe("string");
          });
        });
    });
})
describe("GET /api/shops/:shop_id/food", () => {
  test("GET 200 status code with an array of food items for a specific shop", () => {
    return request(app)
    .get("/api/shops/1/food")
    .expect(200)
    .then(({body}) => {
      const { foods } = body
      expect(foods.length).toBe(2)
      foods.forEach((food) => {
        expect(typeof food.shop_id).toBe("number")
        expect(typeof food.item_name).toBe("string");
        expect(typeof food.quantity).toBe("number");
        expect(typeof food.item_description).toBe("string");
      })
    })
  })
})
