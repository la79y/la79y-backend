const express = require("express");
const userRoutes = require("./routes/userRoutes");
const streamRoute = require("./routes/streamRoute");
const cors = require("cors");
require("dotenv").config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'privkey.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'fullchain.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(cors());
app.get('/.well-known/acme-challenge/7c7nZRoWL2u-ucp_guvx_rmBmvdqlHN1tXMM33goPsY', (req, res) => {
  res.type('text/plain');
  res.send('7c7nZRoWL2u-ucp_guvx_rmBmvdqlHN1tXMM33goPsY.VuRXggp4jG0wvp432d-ubm9SPsbVA4V1ucXvDnKBcRg');
});

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
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(Number(process.env.HTTPS_SERVER_PORT), () => {
    console.log(`HTTPS Server running on port ${process.env.HTTPS_SERVER_PORT}`);
  });
});
