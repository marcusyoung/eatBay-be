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
        expect(shops.length).toBe(5);
        shops.forEach((shop) => {
          expect(typeof shop.shop_name).toBe("string");
          expect(typeof shop.address).toBe("string");
          expect(typeof shop.longitude).toBe("string");
          expect(typeof shop.latitude).toBe("string");
          expect(typeof shop.shop_type).toBe("string");
          expect(typeof shop.food_count).toBe("number");
          expect(typeof shop.pickup_times).toBe("string");
          expect(typeof shop.picture_url).toBe("string");
          expect(typeof shop.notifications).toBe("boolean");
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
  test("GET 200 returns empty array if passed shop_id with no food items", () => {
    return request(app)
    .get("/api/shops/5/food")
    .expect(200)
    .then(({body}) => {
      const {foods} = body
      expect(foods).toEqual([])
    })
  })
  test("GET 404 if passed shop_id does not exist", () => {
    return request(app)
    .get("/api/shops/6/food")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Shop does not exist')
    })
  })
})
describe("GET /api/users/:user_id", () => {
  test("GET 200 status code which returns an object for the passed user_id", () => {
    return request(app)
    .get("/api/users/marcus@northcoders.com")
    .expect(200)
    .then(({body}) => {
      const {user} = body
      expect(user).toBeInstanceOf(Object)
      expect(typeof user.email).toBe("string")
      expect(typeof user.name).toBe("string")
      expect(typeof user.avatar_url).toBe("string")
      expect(typeof user.notifications).toBe("boolean")
    })
  })
  test("GET 404 if passed user_id does not exist", () => {
    return request(app)
    .get("/api/users/test@test.com")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('User does not exist')
    })
  })
})
describe("GET 200 /api/shops/:shop_id", () => {
  test("GET 200 returns object for the passed shop_id", () => {
  return request(app)
  .get("/api/shops/1")
  .expect(200)
  .then(({body}) => {
    const {shop} = body
    expect(shop).toBeInstanceOf(Object)
    expect(typeof shop.admin).toBe("string")
    expect(typeof shop.shop_name).toBe("string")
    expect(typeof shop.address).toBe("string")
    expect(typeof shop.shop_type).toBe("string")
    expect(typeof shop.longitude).toBe("string")
    expect(typeof shop.latitude).toBe("string")
    expect(typeof shop.pickup_times).toBe("string")
    expect(typeof shop.picture_url).toBe("string")
    expect(typeof shop.notifications).toBe("boolean")
  })
})
})
