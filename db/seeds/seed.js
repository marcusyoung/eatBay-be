const format = require("pg-format");
const db = require("../connection");

function seed({ shopsData, usersData }) {
  return db
    .query(`DROP TABLE IF EXISTS users;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS shops;`);
    })
    .then(() => {
      const shopsTablePromise = db.query(`
        CREATE TABLE shops (
            shop_id SERIAL PRIMARY KEY,
            shop_name VARCHAR NOT NULL,
            address VARCHAR NOT NULL,
            shop_type VARCHAR NOT NULL,
            longitude NUMERIC NOT NULL,
            latitude NUMERIC NOT NULL
        );`);

      const userTablePromise = db.query(`
        CREATE TABLE users (
            email VARCHAR PRIMARY KEY,
            password VARCHAR NOT NULL,
            name VARCHAR NOT NULL,
            avatar_url VARCHAR,
            is_shop BOOLEAN
        );`);

      return Promise.all([shopsTablePromise, userTablePromise]);
    })
    .then(() => {
      const insertShopsQueryStr = format(
        'INSERT INTO shops (shop_name, address, shop_type, longitude, latitude ) VALUES %L;',
        shopsData.map(
          ({ shop_name, address, shop_type, longitude, latitude }) => 
            [shop_name, address, shop_type, longitude, latitude]
        )
      );
      const shopsPromise = db.query(insertShopsQueryStr);

      const insertUsersQueryStr = format(
        `INSERT INTO users (email, password, name, avatar_url, is_shop) VALUES %L;`,
        usersData.map(({ email, password, name, avatar_url, is_shop }) => 
          [email, password, name, avatar_url, is_shop]
        )
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([shopsPromise, usersPromise]);
    });
}

module.exports = seed;
