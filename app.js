const express = require('express')
const {
  getShops,
  getEndpoints,
  getFood,
  getFoodByShopId,
} = require("./controllers/controller");

const app = express()
app.use(express.json())


app.get('/api', getEndpoints)

app.get('/api/shops', getShops)

app.get('/api/food', getFood)

app.get("/api/shops/:shop_id/food", getFoodByShopId)

app.all("*", (req, res, next) => {
    res.status(404).send({msg: "endpoint not found"})
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' })
})



module.exports = app