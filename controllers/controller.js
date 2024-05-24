const {
  selectShops,
  selectFoodByShopId,
  selectShopByShopId,
  insertShop,
  selectReservationsByShopId,
  selectFollowersByShopId,
  insertFollowers,
  deleteFollower
} = require("../models/shops.model");
const {
  selectFood,
  selectFoodByFoodId,
  insertFood,
  deleteFood,
  updateFoodQuantity,
} = require("../models/food.model");
const {
  selectUserByUserId,
  insertUser,
  selectReservationsByUserId
} = require("../models/users.model");
const {
  insertReservation,
  updateReservationStatus,
  deleteReservationById
} = require("../models/reservations.model");

const endpoints = require("../endpoints.json");

function getEndpoints(req, res, next) {
  res.status(200).send({ endpoints });
}

function getShops(req, res, next) {
  selectShops()
    .then((shops) => {
      res.status(200).send({ shops: shops });
    })
    .catch(next);
}

function getFood(req, res, next) {
  selectFood()
    .then((food) => {
      res.status(200).send({ foods: food });
    })
    .catch(next);
}

function getFoodByFoodId(req, res, next) {
  const { food_id } = req.params;
  selectFoodByFoodId(food_id)
    .then((food) => {
      res.status(200).send({ food: food });
    })
    .catch(next);
}

function getFoodByShopId(req, res, next) {
  const { shop_id } = req.params;

  selectFoodByShopId(shop_id)
    .then((food) => {
      res.status(200).send({ foods: food });
    })
    .catch(next);
}

function getUserByUserId(req, res, next) {
  const { user_id } = req.params;

  selectUserByUserId(user_id)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch(next);
}

function getShopByShopId(req, res, next) {
  const { shop_id } = req.params;

  selectShopByShopId(shop_id)
    .then((shop) => {
      res.status(200).send({ shop: shop });
    })
    .catch(next);
}

function addUser(req, res, next) {
  insertUser(req.body)
    .then((body) => {
      res.status(201).send({ user: body });
    })
    .catch(next);
}

function addShop(req, res, next) {
  insertShop(req.body)
    .then((body) => {
      res.status(201).send({ shop: body });
    })
    .catch(next);
}

function addFood(req, res, next) {
  const { shop_id } = req.params;

  insertFood(shop_id, req.body)
    .then((body) => {
      res.status(201).send({ food: body });
    })
    .catch(next);
}

function removeFood(req, res, next) {
  const { food_id } = req.params;
  deleteFood(food_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

function patchFoodQuantity(req, res, next) {
  const { food_id } = req.params;
  const { change_quantity } = req.body;

  updateFoodQuantity(change_quantity, food_id)
    .then((body) => {
      res.status(200).send({ food: body });
    })
    .catch(next);
}

function getReservationsByShopId(req, res, next) {
  const { shop_id } = req.params;

  selectReservationsByShopId(shop_id)
    .then((reservations) => {
      res.status(200).send({ reservations });
    })
    .catch(next);
}

function getReservationsByUserId(req, res, next) {
  const { user_id } = req.params;

  selectReservationsByUserId(user_id)
    .then((reservations) => {
      res.status(200).send({ reservations });
    })
    .catch(next);
}

function postReservation(req, res, next) {

  insertReservation(req.body)
    .then((body) => {
      res.status(201).send({ reservation: body })
    })
    .catch(next)
}

function patchReservationStatus(req, res, next) {

  const { reservation_id } = req.params

  updateReservationStatus(reservation_id, req.body)
    .then((body) => {
      res.status(200).send({ reservation: body })
    })
    .catch(next)
}

function getFollowersByShopId(req, res, next) {

  const { shop_id } = req.params;

  selectFollowersByShopId(shop_id)
  .then((body) => {
    res.status(200).send({followers: body})
  })
  .catch(next)
}

function postFollowers(req, res, next) {
  insertFollowers(req.body)
  .then((body) => {
    res.status(201).send({follower: body})
  })
  .catch(next)
}

function unfollow(req, res, next) {
  const {shop_id, user_id} = req.params;

  deleteFollower(shop_id, user_id)
  .then(() => {
    res.status(204).send()
  })
  .catch(next)

}

function removeReservationById(req, res, next) {
  const {reservation_id} = req.params;
  deleteReservationById(reservation_id)
  .then(() => {
    res.status(204).send()
  })
  .catch(next)

}

module.exports = {
  getShops,
  getEndpoints,
  getFood,
  getFoodByFoodId,
  getFoodByShopId,
  getUserByUserId,
  getShopByShopId,
  addUser,
  addShop,
  addFood,
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
};
