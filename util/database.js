require("dotenv").config();

const mysql = require("mysql2");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "expense-tracker",
  "root",
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    logging: false,
  }
);

module.exports = sequelize;
