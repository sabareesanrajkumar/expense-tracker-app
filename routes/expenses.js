const express = require("express");
const router = express.Router();

const expensesController = require("../controllers/expenses");

router.post("/addexpense", expensesController.addExpense);
router.get("/getexpenses", expensesController.getExpenses);

router.delete("/delete/:id", expensesController.deleteExpense);
module.exports = router;
