const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Users = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userName: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  passWord: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.STRING,
  },
  isPremiumUser: Sequelize.BOOLEAN,
  totalExpense: Sequelize.INTEGER,
  totalIncome: Sequelize.INTEGER,
});

module.exports = Users;
