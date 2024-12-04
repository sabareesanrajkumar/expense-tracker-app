const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/users");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("DB sync done");
  })
  .catch((err) => console.log(err));

app.listen(3000);
