const Expenses = require("../models/expenses");
const Users = require("../models/users");
const Sequelize = require("sequelize");

exports.getLeaderBoard = async (req, res, next) => {
  const leaderboardResponse = await Expenses.findAll({
    attributes: [
      "userId",
      [Sequelize.fn("SUM", Sequelize.col("expense")), "totalExpense"],
    ],
    include: [
      {
        model: Users,
        attributes: ["userName"],
      },
    ],
    group: ["userId"],
    order: [[Sequelize.literal("totalExpense"), "DESC"]],
  });

  const formattedResponse = leaderboardResponse.map((record) => {
    return {
      userId: record.userId,
      userName: record.user?.dataValues.userName,
      totalExpense: record.dataValues.totalExpense,
    };
  });
  return res.status(200).json(formattedResponse);
};
