const db = require('../db/connection')

function selectShops() {
    return db.query(
        `SELECT * FROM shops;`
    )
    .then((result) => {
        return result.rows
    })
}

module.exports = selectShops