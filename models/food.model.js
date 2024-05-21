const db = require("../db/connection");

function selectFood() {
  return db.query(`SELECT * FROM food;`).then((result) => {
    return result.rows;
  });
}

module.exports = selectFood