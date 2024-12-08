const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/users");
const expenseRoutes = require("./routes/expenses");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const passwordRoutes = require("./routes/password");

const Expense = require("./models/expenses");
const User = require("./models/users");
const Order = require("./models/orders");
const forgotPasswordRequest = require("./models/forgotpasswordRequests");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

User.hasMany(forgotPasswordRequest, {
  foreignKey: "userId",
});
forgotPasswordRequest.belongsTo(User, {
  foreignKey: "userId",
});

sequelize
  .sync()
  .then(() => {
    console.log("DB sync done");
  })
  .catch((err) => console.log(err));

app.listen(3000);
