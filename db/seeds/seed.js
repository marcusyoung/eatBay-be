const format = require("pg-format");
const db = require("../connection");
const food = require("../data/test-data/food");

function seed({ shopsData, usersData, foodData, reservationsData}) {
  return db
    .query(`DROP TABLE IF EXISTS reservations`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS food;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS shops;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        email VARCHAR PRIMARY KEY,
        password VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR,
        notifications BOOLEAN
      );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE shops (
            shop_id SERIAL PRIMARY KEY,
            admin VARCHAR NOT NULL REFERENCES users (email),
            shop_name VARCHAR NOT NULL,
            address VARCHAR NOT NULL,
            shop_type VARCHAR NOT NULL,
            longitude NUMERIC NOT NULL,
            latitude NUMERIC NOT NULL,
            pickup_times VARCHAR NOT NULL,
            picture_url VARCHAR,
            notifications BOOLEAN
        );`);
    })
    .then(() => {
      return db.query(`
         CREATE TABLE food(
           food_id SERIAL PRIMARY KEY,
           shop_id INTEGER REFERENCES shops (shop_id),
           item_name VARCHAR NOT NULL,
           quantity INTEGER NOT NULL,
           item_description VARCHAR NOT NULL
         );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE reservations(
        reservation_id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL REFERENCES users (email),
        shop_id INTEGER NOT NULL REFERENCES shops (shop_id),
        food_id INTEGER NOT NULL REFERENCES food (food_id),
        status VARCHAR NOT NULL
      );`)
    })
    .then(() => {
      const insertUsersQueryStr = format(
        `INSERT INTO users (email, password, name, avatar_url, notifications) VALUES %L;`,
        usersData.map(
          ({ email, password, name, avatar_url, notifications }) => [
            email,
            password,
            name,
            avatar_url,
            notifications,
          ]
        )
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertShopsQueryStr = format(
        "INSERT INTO shops (admin, shop_name, address, shop_type, longitude, latitude, pickup_times, picture_url, notifications ) VALUES %L;",
        shopsData.map(
          ({
            admin,
            shop_name,
            address,
            shop_type,
            longitude,
            latitude,
            pickup_times,
            picture_url,
            notifications,
          }) => [
              admin,
              shop_name,
              address,
              shop_type,
              longitude,
              latitude,
              pickup_times,
              picture_url,
              notifications,
            ]
        )
      );
      return db.query(insertShopsQueryStr);
    })
    .then(() => {
      const insertFoodQueryStr = format(
        `INSERT INTO food (shop_id, item_name, quantity, item_description) VALUES %L;`,

        foodData.map(({ shop_id, item_name, quantity, item_description }) => [
          shop_id,
          item_name,
          quantity,
          item_description,
        ])
      );
      return db.query(insertFoodQueryStr);
    })
    .then(() => {
      const insertReservationsQueryStr = format(`
      INSERT INTO reservations (email, food_id, shop_id, status) VALUES %L;`,

      reservationsData.map(({email, food_id, shop_id, status}) => [email, food_id, shop_id, status])
        
      );
      return db.query(insertReservationsQueryStr)
    })
}

module.exports = seed;
