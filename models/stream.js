module.exports = (sequelize, DataTypes) => {
  const Stream = sequelize.define("Stream", {
    streamResource: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Stream resource must be unique.',
      },
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "The stream resource can only contain letters and numbers",
        },
        len: {
          args: [3, 25],
          msg: "The stream resource must be between 3 and 25 characters long",
        },
      },
    },
    streamTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        len: {
          args: [3, 25],
          msg: "The stream title resource must be between 3 and 25 characters long",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    streamMode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    streamerLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    streamSrtMode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    streamerUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    playerUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    ffplay:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    }
  });

  Stream.findByStreamName = function (stream_resource) {
    return this.findOne({ where: { stream_resource } });
  };

  return Stream;
};
