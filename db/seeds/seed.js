const format = require("pg-format");
const db = require("../connection");

function seed({ shopsData, usersData, foodData, reservationsData, followersData }) {
  return db
    .query(`DROP TABLE IF EXISTS reservations;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS followers;`)
    })
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
        user_id VARCHAR PRIMARY KEY,
        password VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR,
        notifications BOOLEAN,
        push_token VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE shops (
            shop_id SERIAL PRIMARY KEY,
            admin VARCHAR UNIQUE NOT NULL REFERENCES users (user_id),
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
      CREATE OR REPLACE FUNCTION generate_random_six_digit() RETURNS INTEGER AS $$
      BEGIN
      RETURN floor(random() * 900000 + 100000)::INTEGER;
      END;
      $$ LANGUAGE plpgsql;
      `)
    })
    .then(() => {
      return db.query(`
      SELECT SETSEED(0.5);
      CREATE TABLE reservations(
        id SERIAL PRIMARY KEY,
        reservation_id INTEGER DEFAULT generate_random_six_digit() NOT NULL,
        user_id VARCHAR NOT NULL REFERENCES users (user_id),
        shop_id INTEGER NOT NULL REFERENCES shops (shop_id),
        food_id INTEGER NOT NULL REFERENCES food (food_id),
        status VARCHAR NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE followers (
        follower_id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users (user_id),
        shop_id INTEGER NOT NULL REFERENCES shops (shop_id)
      );
      `)
    })
    .then(() => {
      const insertUsersQueryStr = format(
        `INSERT INTO users (user_id, password, name, avatar_url, notifications) VALUES %L;`,
        usersData.map(
          ({ user_id, password, name, avatar_url, notifications }) => [
            user_id,
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
      INSERT INTO reservations (user_id, food_id, shop_id, status) VALUES %L;`,

        reservationsData.map(({ user_id, food_id, shop_id, status }) => [user_id, food_id, shop_id, status])

      );
      return db.query(insertReservationsQueryStr)
    })
    .then(() => {
      const insertFollowersQueryStr = format(`
      INSERT INTO followers (user_id, shop_id) VALUES %L;`,
        followersData.map(({ user_id, shop_id }) => [user_id, shop_id])
      )
      return db.query(insertFollowersQueryStr)
    })
}

module.exports = seed;
