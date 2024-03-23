const Sequelize = require("sequelize");
const UserModel = require("./models/user");
const StreamModel = require("./models/stream");
const GlobalConfigModel = require("./models/global_config");

// Using environment variables to store sensitive information
const dbName = process.env.DB_NAME || "la79y";
const dbUser = process.env.DB_USER || "admin";
const dbPassword = process.env.DB_PASSWORD || "1234";
const dbHost = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  // other configuration options
});

const User = UserModel(sequelize, Sequelize.DataTypes);
const Stream = StreamModel(sequelize, Sequelize.DataTypes);
const GlobalConfig = GlobalConfigModel(sequelize, Sequelize.DataTypes);

User.hasMany(Stream, { foreignKey: "userId" });
Stream.belongsTo(User, { foreignKey: "userId" });

const models = {
  User,
  Stream,
  GlobalConfig
};

module.exports = { sequelize, Sequelize, models };
