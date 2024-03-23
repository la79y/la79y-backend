module.exports = (sequelize, DataTypes) => {
  const GlobalConfig = sequelize.define("GlobalConfig", {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Config must be unique.',
      }
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  });

  GlobalConfig.findByKey = function (key) {
    return this.findOne({ where: { key } });
  };

  return GlobalConfig;
};
