const express = require('express')
const {
  getShops,
  getEndpoints,
  getFood,
  getFoodByShopId,
  getUserByUserId,
  getShopByShopId
} = require("./controllers/controller");

const app = express()
app.use(express.json())


app.get('/api', getEndpoints)

app.get('/api/shops', getShops)

app.get('/api/food', getFood)

app.get("/api/shops/:shop_id/food", getFoodByShopId)

app.get("/api/users/:user_id", getUserByUserId)

app.get("/api/shops/:shop_id", getShopByShopId)

app.all("*", (req, res, next) => {
    res.status(404).send({msg: "endpoint not found"})
})

// custom error handling
app.use((err, req, res, next) => {
  if (err.custom_error) {
      res.status(err.custom_error.status).send({ msg: err.custom_error.msg })
  } else next(err)
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' })
})



module.exports = app