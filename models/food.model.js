const db = require("../db/connection");

function selectFood() {
  return db.query(`SELECT * FROM food;`).then((result) => {
    return result.rows;
  });
}

function insertFood(shop_id, body){
  const { item_name, quantity, item_description } = body

  return db.query(
    `INSERT INTO food
        (shop_id, item_name, quantity, item_description)
        VALUES ($1, $2, $3, $4)
        RETURNING * ;`,
    [shop_id, item_name, quantity, item_description]
  )
  .then(({rows}) => {
    return rows[0]
  })

}

module.exports = {
  selectFood,
  insertFood
}