require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "local"}`,
});

const { Pool } = require("pg");

const environment = process.env.NODE_ENV || "local";

module.exports = new Pool({
  host: environment === "production" ? process.env.PGHOST : process.env.DB_HOST, // or wherever the db is hosted
  user:
    environment === "production" ? process.env.PGUSER : process.env.DB_USERNAME,
  database:
    environment === "production" ? process.env.PGDATABASE : process.env.DB_USED,
  password:
    environment === "production"
      ? process.env.PGPASSWORD
      : process.env.DB_PASSWORD,
  port:
    parseInt(
      environment === "production" ? process.env.PGPORT : process.env.DB_PORT
    ) || 5432, // The default port
});
