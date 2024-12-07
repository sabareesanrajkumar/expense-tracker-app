const Expenses = require("../models/expenses");
const Users = require("../models/users");
const Sequelize = require("sequelize");

exports.getLeaderBoard = async (req, res, next) => {
  const leaderboardResponse = await Expenses.findAll({
    attributes: [
      "userId",
      [Sequelize.fn("SUM", Sequelize.col("expense")), "totalExpense"],
    ],
    group: ["userId"],
    order: [[Sequelize.literal("totalExpense"), "DESC"]],
  });

  const users = await Users.findAll({
    attributes: ["id", "userName"],
  });

  const leaderBoard = leaderboardResponse.map((entry) => {
    const user = users.find((u) => u.id === entry.userId);
    return {
      userId: entry.userId,
      userName: user ? user.userName : "Unknown",
      totalExpense: parseFloat(entry.dataValues.totalExpense),
    };
  });
  return res.status(200).json(leaderBoard);
};
