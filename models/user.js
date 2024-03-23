const bcrypt = require("bcryptjs");

const saltRounds = 10; // for bcrypt hashing

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username must be unique.',
        },
        validate: {
          isAlphanumeric: {
            args: true,
            msg: "The username can only contain letters and numbers",
          },
          len: {
            args: [3, 25],
            msg: "The username must be between 3 and 25 characters long",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email must be unique.',
        },        validate: {
          isEmail: {
            args: true,
            msg: "Email must be a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 100],
            msg: "The password must be at least 6 characters long",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await hashPassword(user.password);
        },
      },
    }
  );

  User.prototype.verifyPassword = async function (password) {
    return await comparePassword(password, this.password);
  };

  User.findByUsername = function (username) {
    return this.findOne({ where: { username } });
  };

  return User;
};

async function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
