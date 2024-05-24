const db = require("../db/connection");

function checkValidShopId(shop_id) {
  return db
    .query(`SELECT * FROM shops WHERE shop_id = $1;`, [shop_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          custom_error: {
            status: 404,
            msg: `Shop does not exist`,
          },
        });
      } else {
        return;
      } // important to return
    });
}

function selectShops() {
  return db
    .query(
      `SELECT a.shop_id, a.admin, a.shop_name, a.address, a.shop_type, a.longitude, a.latitude, a.pickup_times, a.picture_url, a.notifications, count(b.food_id)::int AS food_count
        FROM shops a
        LEFT JOIN food b
        ON a.shop_id = b.shop_id
        GROUP BY a.shop_id
        ;`
    )
    .then((result) => {
      return result.rows;
    });
}

function selectFoodByShopId(shop_id) {
  // check for valid shop_id
  return checkValidShopId(shop_id).then(() => {
    return db
      .query(`SELECT * FROM food WHERE shop_id = $1`, [shop_id])
      .then((result) => {
        return result.rows;
      });
  });
}

function selectShopByShopId(shop_id) {
  return checkValidShopId(shop_id).then(() => {
    return db
      .query(`SELECT * FROM shops where shop_id = $1`, [shop_id])
      .then((result) => {
        return result.rows[0];
      });
  });
}


function insertShop(body) {
  const {
    admin,
    shop_name,
    address,
    longitude,
    latitude,
    shop_type,
    pickup_times,
    picture_url,
    notifications,
  } = body;

  return db
    .query(
      `INSERT INTO shops
        (admin, shop_name, address, longitude, latitude, shop_type, pickup_times, picture_url, notifications)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING * ;`,
      [
        admin,
        shop_name,
        address,
        longitude,
        latitude,
        shop_type,
        pickup_times,
        picture_url,
        notifications,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function selectReservationsByShopId(shop_id) {
  return checkValidShopId(shop_id).then(() => {
    return db
      .query(`SELECT * FROM reservations WHERE shop_id = $1;`, [shop_id])
      .then((result) => {
        return result.rows;
      });
  })
}

function selectFollowersByShopId(shop_id) {
  return checkValidShopId(shop_id).then(() => {
    return db.query(`SELECT * FROM followers WHERE shop_id = $1;`, [shop_id])
      .then((result) => {
        return result.rows;
      })
  })
}

function insertFollowers(body) {

  const {email, shop_id} = body

  return db.query(`INSERT INTO followers (email, shop_id) VALUES ($1, $2) RETURNING *;`, [email, shop_id])
  .then((result) => {
    return result.rows[0];
  })

}

function deleteFollower(shop_id, user_id) {
  return db.query(
    `
  DELETE FROM followers WHERE shop_id = $1 AND email = $2;`,
    [shop_id, user_id]
  );
}

module.exports = {
  selectShops,
  selectFoodByShopId,
  selectShopByShopId,
  insertShop,
  selectReservationsByShopId,
  selectFollowersByShopId,
  insertFollowers,
  deleteFollower
};
