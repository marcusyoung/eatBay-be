const express = require("express");
const {
  getShops,
  getEndpoints,
  getFood,
  getFoodByShopId,
  getUserByUserId,
  getShopByShopId,
  addUser,
  addShop,
  addFood,
  getFoodByFoodId,
  removeFood,
  patchFoodQuantity,
  getReservationsByShopId,
  getReservationsByUserId,
  postReservation,
  patchReservationStatus,
  getFollowersByShopId,
  postFollowers,
  unfollow,
  removeReservationById
} = require("./controllers/controller");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/shops", getShops);

app.get("/api/food", getFood);

app.get("/api/food/:food_id", getFoodByFoodId);

app.get("/api/shops/:shop_id/food", getFoodByShopId);

app.get("/api/users/:user_id", getUserByUserId);

app.get("/api/shops/:shop_id", getShopByShopId);

app.get("/api/shops/:shop_id/reservations", getReservationsByShopId)

app.get("/api/users/:user_id/reservations", getReservationsByUserId)

app.get("/api/shops/:shop_id/followers", getFollowersByShopId)

app.post("/api/users", addUser);

app.post("/api/shops", addShop)

app.post("/api/shops/:shop_id/food", addFood)

app.post("/api/reservations", postReservation)

app.post("/api/shops/followers", postFollowers)

app.patch("/api/food/:food_id/update_quantity", patchFoodQuantity)

app.patch("/api/reservations/:reservation_id", patchReservationStatus)

app.delete("/api/food/:food_id", removeFood)

app.delete("/api/shops/:shop_id/:user_id/followers", unfollow)

app.delete("/api/reservations/:reservation_id", removeReservationById)

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "endpoint not found" });
});

// custom error handling
app.use((err, req, res, next) => {
 
  if (err.custom_error) {
    res.status(err.custom_error.status).send({ msg: err.custom_error.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  //console.log(err)
  switch (err.code) {
    case "22P02":
      res
        .status(400)
        .send({ msg: "Invalid input (invalid_text_representation)" });
      break;
    case "23502":
      res.status(400).send({ msg: "Invalid input (not_null_violation)" });
      break;
    case "23503":
      res.status(404).send({ msg: "Invalid input (foreign_key_violation)" });
      break;
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
