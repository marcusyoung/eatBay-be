const { selectShops, selectFoodByShopId, selectShopByShopId } = require("../models/shops.model");
const selectFood = require("../models/food.model");
const { selectUserByUserId } = require("../models/users.model")
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
    res.status(200).send({user: user})
  })
  .catch(next);

}

function getShopByShopId(req, res, next) {

  const {shop_id} = req.params

  selectShopByShopId(shop_id)
  .then((shop) => {
    res.status(200).send({shop: shop})
  })
  .catch(next)

}

module.exports = {
  getShops,
  getEndpoints,
  getFood,
  getFoodByShopId,
  getUserByUserId,
  getShopByShopId
};
