"use strict";
const path = require("path");
const Database = require("better-sqlite3");
const db = new Database(path.resolve(__dirname, "jokebook.db"));

function all(sql, params = []) {
  console.log('Executing query:', sql);
  console.log('With parameters:', params);

  // Ensure params is an array of valid types
  if (!Array.isArray(params) || params.some(param => param === undefined || param === null)) {
    console.error('Invalid parameters passed to query:', params);
    throw new Error('Invalid parameters');
  }

  try {
    // Use .all() instead of .get() to fetch multiple rows
    return db.prepare(sql).all(...params);
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

function get(sql, ...params) {
  return db.prepare(sql).get(...params);
}

function run(sql, ...params) {
  return db.prepare(sql).run(...params);
}

function exec(sql) {
  return db.exec(sql);
}

function db_close() {
  console.log("...Closing database connection.");
  db.close();
}

module.exports = {
  all,
  get,
  run,
  exec,
  db_close
};
