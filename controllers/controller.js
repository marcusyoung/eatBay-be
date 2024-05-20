const selectShops = require("../models/shops.model")
const endpoints = require("../endpoints.json")

function getEndpoints(req, res, next) {
    res.status(200).send({endpoints})
}


function getShops(req, res, next) {

selectShops()
    .then((shops) => {
        res.status(200).send({shops: shops})
    })
    .catch(next)
}


module.exports = { getShops, getEndpoints }