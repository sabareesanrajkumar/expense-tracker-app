const Expenses = require("../models/expenses");
const Users = require("../models/users");
const Sequelize = require("sequelize");

exports.getLeaderBoard = async (req, res, next) => {
  const leaderboardResponse = await Expenses.findAll({
    attributes: ["userId"],
    include: [
      {
        model: Users,
        attributes: ["userName", "totalExpense"],
      },
    ],
    group: ["userId"],
    order: [[Sequelize.literal("totalExpense"), "DESC"]],
  });

  const formattedResponse = leaderboardResponse.map((record) => {
    return {
      userId: record.userId,
      userName: record.user?.dataValues.userName,
      totalExpense: record.user?.dataValues.totalExpense,
    };
  });
  return res.status(200).json(formattedResponse);
};
