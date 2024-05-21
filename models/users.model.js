const db = require('../db/connection')


function checkValidUserId(user_id) {

    return db.query(`SELECT * FROM users WHERE email = $1;`, [user_id])
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
                `SELECT email, name, notifications, avatar_url FROM users WHERE email = $1`, [user_id]
            )
            .then((result) => {
                return result.rows[0]
            })
        })
        }

module.exports = { selectUserByUserId }