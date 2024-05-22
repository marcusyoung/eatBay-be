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
});
describe("GET /api/shops/:shop_id/food", () => {
  test("GET 200 status code with an array of food items for a specific shop", () => {
    return request(app)
      .get("/api/shops/1/food")
      .expect(200)
      .then(({ body }) => {
        const { foods } = body;
        expect(foods.length).toBe(2);
        foods.forEach((food) => {
          expect(typeof food.shop_id).toBe("number");
          expect(typeof food.item_name).toBe("string");
          expect(typeof food.quantity).toBe("number");
          expect(typeof food.item_description).toBe("string");
        });
      });
  });
  test("GET 200 returns empty array if passed shop_id with no food items", () => {
    return request(app)
      .get("/api/shops/5/food")
      .expect(200)
      .then(({ body }) => {
        const { foods } = body;
        expect(foods).toEqual([]);
      });
  });
  test("GET 404 if passed shop_id does not exist", () => {
    return request(app)
      .get("/api/shops/6/food")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Shop does not exist");
      });
  });
});
describe("GET /api/users/:user_id", () => {
  test("GET 200 status code which returns an object for the passed user_id", () => {
    return request(app)
      .get("/api/users/marcus@northcoders.com")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toBeInstanceOf(Object);
        expect(typeof user.email).toBe("string");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
        expect(typeof user.notifications).toBe("boolean");
      });
  });
  test("GET 404 if passed user_id does not exist", () => {
    return request(app)
      .get("/api/users/test@test.com")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist");
      });
  });
});
describe("GET /api/shops/:shop_id", () => {
  test("GET 200 returns object for the passed shop_id", () => {
    return request(app)
      .get("/api/shops/1")
      .expect(200)
      .then(({ body }) => {
        const { shop } = body;
        expect(shop).toBeInstanceOf(Object);
        expect(typeof shop.admin).toBe("string");
        expect(typeof shop.shop_name).toBe("string");
        expect(typeof shop.address).toBe("string");
        expect(typeof shop.shop_type).toBe("string");
        expect(typeof shop.longitude).toBe("string");
        expect(typeof shop.latitude).toBe("string");
        expect(typeof shop.pickup_times).toBe("string");
        expect(typeof shop.picture_url).toBe("string");
        expect(typeof shop.notifications).toBe("boolean");
      });
  });
  test("GET 404 when passed a shop_id that does not exist", () => {
    return request(app)
      .get("/api/shops/122222")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Shop does not exist");
      });
  });
});
describe("POST /api/users", () => {
  test("POST 201 status code when added a new user and returns the user object", () => {
    const newUser = {
      email: "mitch@northcoders.com",
      password: "northcoders",
      name: "Mitch",
    };
    const insertedUser = {
      email: "mitch@northcoders.com",
      name: "Mitch",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject(insertedUser);
      });
  });
  test("POST 400 if passed user does not have email property", () => {
    const newUser = {
      password: "northcoders",
      name: "Mitch",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input (not_null_violation)");
      });
  });
  test("POST 400 if passed user does not have password property", () => {
    const newUser = {
      email: "mitch@northcoders.com",
      name: "Mitch",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input (not_null_violation)");
      });
  });
  test("POST 400 if passed user does not have name property", () => {
    const newUser = {
      email: "mitch@northcoders.com",
      password: "northcoders",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input (not_null_violation)");
      });
  });
});
describe("POST /api/shops", () => {
  test("POST 201 status code when added a new shop and returns the shop object", () => {
    const newShop = {
      admin: "keith22@northcoders.com",
      shop_name: "Keith's Cafe Ltd",
      address: "Southampton Harley Davidson",
      longitude: -1.459433,
      latitude: 50.917245,
      shop_type: "Restaurant/Cafe/Canteen",
      pickup_times: "Mon-Sat 9pm - 11pm, Sun 8pm - 10pm",
      picture_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0eTVVGmN6CnrWTtfiL7QpJBTpIBsFpd0kZuPQfWwnwL6DHAmU5-eqkVbak84PfJYxjaJZMyLXbqOOfItSchjUS7IrJ_Ezamolbc0_ZtTOHRuGg8hAibbHsGo2wBUrLbYDhIYZ43o_gWNF/s1600/IMG_2341.JPG",
      notifications: true,

    };

    const insertedShop = {
      admin: "keith22@northcoders.com",
      shop_id: 6,
      shop_name: "Keith's Cafe Ltd",
      address: "Southampton Harley Davidson",
      longitude: "-1.459433",
      latitude: "50.917245",
      shop_type: "Restaurant/Cafe/Canteen",
      pickup_times: "Mon-Sat 9pm - 11pm, Sun 8pm - 10pm",
      picture_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0eTVVGmN6CnrWTtfiL7QpJBTpIBsFpd0kZuPQfWwnwL6DHAmU5-eqkVbak84PfJYxjaJZMyLXbqOOfItSchjUS7IrJ_Ezamolbc0_ZtTOHRuGg8hAibbHsGo2wBUrLbYDhIYZ43o_gWNF/s1600/IMG_2341.JPG",
      notifications: true,
    };
    return request(app)
      .post("/api/shops")
      .send(newShop)
      .expect(201)
      .then(({ body }) => {
        const { shop } = body;
        expect(shop).toMatchObject(insertedShop);
      });
  });
    test("POST 404 if passed shop has admin value that does not exist in user table", () => {
      const newShop = {
        admin: "helloworld@northcoders.com",
        shop_name: "Keith's Cafe Ltd",
        address: "Southampton Harley Davidson",
        longitude: -1.459433,
        latitude: 50.917245,
        shop_type: "Restaurant/Cafe/Canteen",
        pickup_times: "Mon-Sat 9pm - 11pm, Sun 8pm - 10pm",
        picture_url:
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0eTVVGmN6CnrWTtfiL7QpJBTpIBsFpd0kZuPQfWwnwL6DHAmU5-eqkVbak84PfJYxjaJZMyLXbqOOfItSchjUS7IrJ_Ezamolbc0_ZtTOHRuGg8hAibbHsGo2wBUrLbYDhIYZ43o_gWNF/s1600/IMG_2341.JPG",
        notifications: true
      };
      return request(app)
        .post("/api/shops")
        .send(newShop)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input (foreign_key_violation)");
        });
    });
    test("POST 400 if passed shop does not have shop_name property", () => {
      const newShop = {
        admin: "keith22@northcoders.com",
        address: "Southampton Harley Davidson",
        longitude: -1.459433,
        latitude: 50.917245,
        shop_type: "Restaurant/Cafe/Canteen",
        pickup_times: "Mon-Sat 9pm - 11pm, Sun 8pm - 10pm",
        picture_url:
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0eTVVGmN6CnrWTtfiL7QpJBTpIBsFpd0kZuPQfWwnwL6DHAmU5-eqkVbak84PfJYxjaJZMyLXbqOOfItSchjUS7IrJ_Ezamolbc0_ZtTOHRuGg8hAibbHsGo2wBUrLbYDhIYZ43o_gWNF/s1600/IMG_2341.JPG",
        notifications: true,
      };
      return request(app)
        .post("/api/shops")
        .send(newShop)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input (not_null_violation)");
        });
    });
});
// describe("POST /api/shops/:shop_id/food", () => {
//   test("POST 201 status code when ")
// })
