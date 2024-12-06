const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/users");
const expenseRoutes = require("./routes/expenses");

const Expense = require("./models/expenses");
const User = require("./models/users");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("DB sync done");
  })
  .catch((err) => console.log(err));

app.listen(3000);
