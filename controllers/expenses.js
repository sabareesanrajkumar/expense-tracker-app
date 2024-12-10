const Expenses = require("../models/expenses");
const Users = require("../models/users");
const Sequelize = require("../util/database");

exports.addExpense = async (req, res, next) => {
  const t = await Sequelize.transaction();
  try {
    await Expenses.create(
      {
        ...req.body,
        userId: req.user.id,
      },
      { transaction: t }
    );
    let newTotalExpense = +req.user.totalExpense + +req.body.expense;

    await req.user.update(
      {
        totalExpense: newTotalExpense,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({ success: true, message: "expense created" });
  } catch (err) {
    await t.rollback();
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
  const expenseId = req.params.expenseId;
  const userId = req.user.id;
  const t = await Sequelize.transaction();

  try {
    const oldExpense = await Expenses.findOne({
      where: { id: expenseId, userId: userId },
    });

    await Users.update(
      {
        totalExpense: Sequelize.literal(`totalExpense - ${oldExpense.expense}`),
      },
      { where: { id: userId }, transaction: t }
    );
    await Expenses.destroy({
      where: { id: expenseId, userId: userId },
      transaction: t,
    });

    await t.commit();
    res.status(200).json({ success: true, message: "expense deleted" });
  } catch (err) {
    await t.rollback();

    res.status(500).json({ success: false, message: "couldn't deleted" });
  }
};
