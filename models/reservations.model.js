const db = require("../db/connection");

function checkValidReservationId(reservation_id) {
    return db
      .query(`SELECT * FROM reservations WHERE reservation_id = $1;`, [reservation_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            custom_error: {
              status: 404,
              msg: `Reservation does not exist`,
            },
          });
        } else {
          return;
        } // important to return
      });
  }

function insertReservation(body) {
    const { shop_id, food_id, email, status } = body

    return db.query(
        `INSERT INTO reservations (shop_id, food_id, email, status) 
        VALUES ($1, $2, $3, $4) RETURNING *;`, [shop_id, food_id, email, status]
    )
    .then((reservation) => {
        return reservation.rows[0]
    })
}

function updateReservationStatus(reservation_id, body) {
    const {status} = body
    return checkValidReservationId(reservation_id).then(() => {
        return db.query(
            `UPDATE reservations SET status = $1 WHERE reservation_id = $2 RETURNING *;`, [status, reservation_id]
        )
        .then((result) => {
            return result.rows[0]
        })
    })
}

module.exports = { insertReservation, updateReservationStatus }