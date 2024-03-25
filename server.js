const express = require("express");
const userRoutes = require("./routes/userRoutes");
const streamRoute = require("./routes/streamRoute");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

const { sequelize } = require("./database");

app.use(express.json()); // for parsing application/json

// Use the routes
app.use("/", userRoutes);

app.use("/", streamRoute);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  }
});

sequelize.sync().then(() => {
  app.listen(Number(process.env.SERVER_PORT), () =>
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
  );
});
