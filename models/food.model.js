const db = require("../db/connection");

function checkValidFoodId(food_id) {
  return db
    .query(`SELECT * FROM food WHERE food_id = $1;`, [food_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          custom_error: {
            status: 404,
            msg: `Food item does not exist`,
          },
        });
      } else {
        return;
      } // important to return
    });
}


function selectFood() {
  return db
    .query(
      `SELECT a.food_id, a.shop_id, a.item_name, a.quantity, a.item_description, b.picture_url
        FROM food a
        LEFT JOIN shops b 
        ON a.shop_id = b.shop_id;`
    )
    .then((result) => {
      return result.rows;
    });
}

function selectFoodByFoodId(food_id) {
  return checkValidFoodId(food_id).then(() => {
    return db
      .query(
        `SELECT a.food_id, a.shop_id, a.item_name, a.quantity, a.item_description, b.picture_url
        FROM food a
        LEFT JOIN shops b 
        ON a.shop_id = b.shop_id WHERE food_id = $1;`,
        [food_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  })
}

function insertFood(shop_id, body) {
  const { item_name, quantity, item_description} = body
  return db.query(
    `INSERT INTO food
        (shop_id, item_name, quantity, item_description)
        VALUES ($1, $2, $3, $4)
        RETURNING * ;`,
    [shop_id, item_name, quantity, item_description]
  )
    .then(({ rows }) => {
      return rows[0]
    })
}

function deleteFood(food_id) {
  return checkValidFoodId(food_id).then(() => {
    return db.query(
      `DELETE FROM food WHERE food_id = $1;`, [food_id]
    )
  })
}

function updateFoodQuantity(changeQuantity,food_id) {
 return checkValidFoodId(food_id).then(() => {
   return db.query(
     `UPDATE food
     SET quantity = quantity + $1
     WHERE food_id = $2
     RETURNING * ;`,
     [changeQuantity, food_id]
   )
   .then((result) => {
     return result.rows[0]
   })
 })

}

module.exports = {
  selectFood,
  selectFoodByFoodId,
  insertFood,
  deleteFood,
  updateFoodQuantity
};