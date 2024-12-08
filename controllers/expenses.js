const Expenses = require("../models/expenses");
const Users = require("../models/users");
const Sequelize = require("sequelize");

exports.addExpense = async (req, res, next) => {
  try {
    const newExpense = await Expenses.create({
      ...req.body,
      userId: req.user.id,
    });
    let newTotalExpense = +req.user.totalExpense + +req.body.expense;

    await req.user.update({
      totalExpense: newTotalExpense,
    });

    return res.status(200).json({ success: true, message: "expense created" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "failed to store expense in database" });
  }
};

exports.getExpenses = async (req, res, next) => {
  await Expenses.findAll({ where: { userId: req.user.id } })
    .then((expense) => {
      return res.status(200).json(expense);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "sometihng went wrong" });
    });
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.id;
  const userId = req.params.userId;

  const oldExpense = await Expenses.findOne({
    where: { id: expenseId, userId: userId },
  });

  await Users.update(
    { totalExpense: Sequelize.literal(`totalExpense - ${oldExpense.expense}`) },
    { where: { id: userId } }
  );
  await Expenses.destroy({ where: { id: expenseId, userId: userId } });

  res.status(200).json({ success: true, message: "expense deleted" });
};
