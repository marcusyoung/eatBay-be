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
        expect(typeof user.user_id).toBe("string");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
        expect(typeof user.notifications).toBe("boolean")
        expect(typeof user.users_shop_id).toBe("number");
      });
  });
  test("GET 200 expect users_shops_id to be null if user does not have a shop", () => {
    return request(app)
      .get("/api/users/justin@northcoders.com")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toBeInstanceOf(Object);
        expect(user.users_shop_id).toBeNull;
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
      user_id: "mitch@northcoders.com",
      password: "northcoders",
      name: "Mitch",
    };
    const insertedUser = {
      user_id: "mitch@northcoders.com",
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
  test("POST 400 if passed user does not have user_id property", () => {
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
      user_id: "mitch@northcoders.com",
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
      user_id: "mitch@northcoders.com",
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
      admin: "justin@northcoders.com",
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
      admin: "justin@northcoders.com",
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
      notifications: true,
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
describe("POST /api/shops/:shop_id/food", () => {
  test("POST 201 status code when added a new food item and returns the food object", () => {
    const newFood = {
      shop_id: 4,
      item_name: "Plain margherita pizza",
      quantity: 1,
      item_description:
        "Fugiat consectetur non deserunt consectetur aute aliquip aliquip cillum cupidatat aliqua occaecat sunt in velit.",
    };
    const insertedFood = {
      shop_id: 4,
      food_id: 6,
      item_name: "Plain margherita pizza",
      quantity: 1,
      item_description:
        "Fugiat consectetur non deserunt consectetur aute aliquip aliquip cillum cupidatat aliqua occaecat sunt in velit.",
    };
    return request(app)
      .post("/api/shops/4/food")
      .send(newFood)
      .expect(201)
      .then(({ body }) => {
        const { food } = body;
        expect(food).toMatchObject(insertedFood);
      });
  });
  test("POST 404 when passed a shop_id that does not exist", () => {
    const newFood = {
      shop_id: 4,
      item_name: "Plain margherita pizza",
      quantity: 1,
      item_description:
        "Fugiat consectetur non deserunt consectetur aute aliquip aliquip cillum cupidatat aliqua occaecat sunt in velit.",
    };

    return request(app)
      .post("/api/shops/122222/food")
      .send(newFood)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input (foreign_key_violation)");
      });
  });
});
describe("GET /api/food/:food_id", () => {
  test("GET 200 returns food object for specified food_id", () => {
    return request(app)
      .get("/api/food/1")
      .expect(200)
      .then(({ body }) => {
        const { food } = body;
        expect(typeof food.food_id).toBe("number");
        expect(typeof food.shop_id).toBe("number");
        expect(typeof food.item_name).toBe("string");
        expect(typeof food.quantity).toBe("number");
        expect(typeof food.item_description).toBe("string");
      });
  });
  test("GET 404 when wrong food_id is provided", () => {
    return request(app)
      .get("/api/food/10")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Food item does not exist");
      });
  });
});
describe("DELETE 204 /api/food/:food_id", () => {
  test("DELETE responds 204 when successfully deletes the specified food item based on food_id", () => {
    return request(app)
      .delete("/api/food/4")
      .expect(204)
      .then(() => {
        return request(app).get("/api/food/4").expect(404);
      });
  });
  test("DELETE 404 when wrong food_id is provided", () => {
    return request(app)
      .delete("/api/food/10")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Food item does not exist");
      });
  });
});
describe("PATCH /api/food/:food_id/update_quantity", () => {
  test("PATCH: responds with a 200 status code when food quantity has changed", () => {
    const changeFoodQuantity = { change_quantity: -1 };
    return request(app)
      .patch("/api/food/1/update_quantity")
      .send(changeFoodQuantity)
      .expect(200)
      .then(({ body }) => {
        const { food } = body;
        expect(food.quantity).toBe(9);
      });
  });
  test("PATCH: responds with a 404 when provided a food_id which does not exist", () => {
    const changeFoodQuantity = { change_quantity: -1 };
    return request(app)
      .patch("/api/food/12345/update_quantity")
      .send(changeFoodQuantity)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Food item does not exist");
      });
  });
});
describe("GET /api/shops/shop_id/reservations", () => {
  test("GET 200 status code with an array of reservations object when passed shop_id", () => {
    return request(app)
      .get("/api/shops/2/reservations")
      .expect(200)
      .then(({ body }) => {
        const { reservations } = body;
        reservations.forEach((reservation) => {
          expect(typeof reservation.reservation_id).toBe("number");
          expect(typeof reservation.user_id).toBe("string");
          expect(typeof reservation.shop_id).toBe("number");
          expect(typeof reservation.food_id).toBe("number");
          expect(typeof reservation.status).toBe("string");
        });
      });
  });
  test("GET 404 status code when provided invalid shop_id", () => {
    return request(app)
      .get("/api/shops/12345/reservations")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Shop does not exist");
      });
  });
  test("GET 200 returns empty array if passed shop_id with no reservations", () => {
    return request(app)
      .get("/api/shops/5/reservations")
      .expect(200)
      .then(({ body }) => {
        const { reservations } = body;
        expect(reservations).toEqual([]);
      });
  });
});
describe("GET /api/users/user_id/reservations", () => {
  test("GET 200 status code with an array of reservations object when passed with user_id", () => {
    return request(app)
      .get("/api/users/sofe@northcoders.com/reservations")
      .expect(200)
      .then(({ body }) => {
        const { reservations } = body;
        reservations.forEach((reservation) => {
          expect(typeof reservation.reservation_id).toBe("number");
          expect(typeof reservation.user_id).toBe("string");
          expect(typeof reservation.shop_id).toBe("number");
          expect(typeof reservation.food_id).toBe("number");
          expect(typeof reservation.status).toBe("string");
          expect(typeof reservation.shop_name).toBe("string")
          expect(typeof reservation.address).toBe("string")
          expect(typeof reservation.pickup_times).toBe("string")
          expect(typeof reservation.item_name).toBe("string")
        });
      });
  })
  test("GET 404 status code when provided invalid user_id", () => {
    return request(app)
      .get("/api/users/12345/reservations")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist");
      });
  });
  test("GET 200 returns empty array if passed user_id with no reservations", () => {
    return request(app)
      .get("/api/users/verity@northcoders.com/reservations")
      .expect(200)
      .then(({ body }) => {
        const { reservations } = body;
        expect(reservations).toEqual([]);
      });
  });
})
describe("POST /api/reservations", () => {
  test("POST 201 status code when user has reserved an item and return reservation object", () => {
    const newReservation = {
      user_id: "verity@northcoders.com",
      shop_id: 3,
      food_id: 1,
      status: "Pending collection"
    }
    const insertedReservation = {
      reservation_id: 6,
      user_id: "verity@northcoders.com",
      shop_id: 3,
      food_id: 1,
      status: "Pending collection"
    }
    return request(app)
      .post('/api/reservations')
      .send(newReservation)
      .expect(201)
      .then(({ body }) => {
        const { reservation } = body;
        expect(reservation).toMatchObject(insertedReservation);
      })
  })
  test("POST 404 if passed reservation has user_id value that does not exist in user table", () => {
    const newReservation = {
      user_id: "invalid@northcoders.com",
      shop_id: 3,
      food_id: 1,
      status: "Pending collection"
    };
    return request(app)
      .post("/api/reservations")
      .send(newReservation)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input (foreign_key_violation)");
      });
  });
})
describe("PATCH /api/reservations/:reservation_id", () => {
  test('PATCH 200 updates reservation status for reservation_id', () => {
    const newStatus = { status: "Sold" }
    return request(app)
      .patch("/api/reservations/1")
      .send(newStatus)
      .expect(200)
      .then(({ body }) => {
        const { reservation } = body
        expect(reservation.status).toBe("Sold")
      })
  })
  test('PATCH 404 when reservation_id does not exist', () => {
    const newStatus = { status: "Sold" }
    return request(app)
      .patch("/api/reservations/10")
      .send(newStatus)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Reservation does not exist")
      })
  })
})
describe('GET /api/shops/:shop_id/followers', () => {
  test('GET 200 status code and an array of follower objects for the passed shop_id', () => {
    return request(app)
      .get('/api/shops/1/followers')
      .expect(200)
      .then(({ body }) => {
        const { followers } = body
        followers.map((follower) => {
          expect(typeof follower.follower_id).toBe("number")
          expect(typeof follower.user_id).toBe("string")
          expect(typeof follower.shop_id).toBe("number")
        })
      })
  })
  test('GET 404 status code when provided shop_id does not exist', () => {
    return request(app)
      .get('/api/shops/10/followers')
      .expect(404)
      .then(({ body }) => {
        const { followers } = body
        expect(body.msg).toBe("Shop does not exist")
      })
  })
  test("GET 200 returns empty array if passed shop_id with no followers", () => {
    return request(app)
      .get("/api/shops/4/followers")
      .expect(200)
      .then(({ body }) => {
        const { followers } = body;
        expect(followers).toEqual([]);
      });
  });
})
describe("POST /api/shops/followers", () => {
  test("POST 201 status code when added a new follower and returns the follower object", () => {
    const newFollower = { user_id: "jennifer@northcoders.com", shop_id: 2 }
    const insertedFollower = { follower_id: 6, user_id: "jennifer@northcoders.com", shop_id: 2 }
    return request(app)
      .post("/api/shops/followers")
      .send(newFollower)
      .expect(201)
      .then(({ body }) => {
        const { follower } = body;
        expect(follower).toMatchObject(insertedFollower);
      })
  })
  test("POST 404 if passed reservation has user_id value that does not exist in user table", () => {
    const newFollower = { user_id: "invalid@northcoders.com", shop_id: 2 }
    return request(app)
      .post("/api/shops/followers")
      .send(newFollower)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input (foreign_key_violation)");
      });
  });
  test("POST 404 if passed reservation has shop_id that does not exist in shop table", () => {
    const newFollower = { user_id: "jennifer@northcoders.com", shop_id: 10 }
    return request(app)
      .post("/api/shops/followers")
      .send(newFollower)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input (foreign_key_violation)");
      });
  });
})
describe("DELETE /api/shops/:shop_id/:user_id/followers", () => {
  test("DELETE 204 status code when a user unfollows a shop, based on the shop_id", () => {
    return request(app)
      .delete("/api/shops/3/keith22@northcoders.com/followers")
      .expect(204)
  })
  test("DELETE 400 status code if attempt to unfollow a shop that is not followed", () => {
    return request(app)
      .delete("/api/shops/3/justin@northcoders.com/followers")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No matching follower found")
      })
  })
})
describe("DELETE /api/reservations/:reservation_id", () => {
  test("DELETE 204 status code when a users removes a reservation", () => {
    return request(app)
      .delete("/api/reservations/1")
      .expect(204)
  })
  test("DELETE 400 status code when a users attempts to remove a reservation that has status sold", () => {
    return request(app)
      .delete("/api/reservations/4")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Cannot remove a reservation that is already sold")
      })
  })
})
