module.exports = (sequelize, DataTypes) => {
    const Stream = sequelize.define("Stream", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            comment: 'will be used as streamResource , stream id'
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
        streamerLocation: {
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
        ffplay: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        isStreaming: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    Stream.findByStreamName = function (stream_resource) {
        return this.findOne({where: {stream_resource}});
    };

    return Stream;
};
