const db = require('../db/connection')

function selectShops() {
    return db.query(
        `SELECT * FROM shops;`
    )
    .then((result) => {
        return result.rows
    })
}

function selectFoodByShopId(shop_id) {
    return db.query(
        `SELECT * FROM food WHERE shop_id = $1`, [shop_id]
    )
    .then((result) => {
        return result.rows
    })

}

module.exports = {
    selectShops,
    selectFoodByShopId
}