const Expenses = require("../models/expenses");

exports.addExpense = async (req, res, next) => {
  try {
    const newExpense = await Expenses.create({
      ...req.body,
      userId: req.user.id,
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
  await Expenses.destroy({ where: { id: expenseId, userId: userId } });
  res.status(200).json({ success: true, message: "expense deleted" });
};
