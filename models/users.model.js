const db = require('../db/connection')


function checkValidUserId(user_id) {

    return db.query(`SELECT * FROM users WHERE user_id = $1;`, [user_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    custom_error: {
                        status: 404,
                        msg: `User does not exist`
                    }
                })
            } else { return } // important to return 
        })
}


function selectUserByUserId(user_id) {
    //check for valid user_id
    return checkValidUserId(user_id)        
        .then(() => {
            return db.query(
                `SELECT a.user_id, a.name, a.notifications, a.avatar_url, b.shop_id AS users_shop_id FROM users a
                LEFT JOIN shops b
                ON a.user_id = b.admin
                WHERE user_id = $1;
                `, [user_id]
            )
            .then((result) => {
                return result.rows[0]
            })
        })
}

function insertUser(body) {
   const {user_id, password, name} = body

    return db
    .query(
        `INSERT INTO users
        (user_id, password, name)
        VALUES ($1, $2, $3)
        RETURNING user_id, name;`,
        [user_id, password, name]
    )
    .then(({rows}) => {
        return rows[0]
    })
}

function selectReservationsByUserId(user_id) {
  return checkValidUserId(user_id).then(() => {
    return db
      .query(`SELECT a.reservation_id, a.user_id, a.shop_id, a.food_id, a.status, b.shop_name, b.address, b.pickup_times, c.item_name FROM reservations a
      LEFT JOIN shops b ON a.shop_id = b.shop_id
      LEFT JOIN food c ON a.food_id = c.food_id
      WHERE user_id = $1`, [user_id])
      .then((result) => {
        return result.rows;
      });
  });
}


module.exports = { 
    selectUserByUserId,
    insertUser,
    selectReservationsByUserId
}