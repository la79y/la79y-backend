module.exports = (sequelize, DataTypes) => {
    const Sessions = sequelize.define("Sessions", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            comment: 'will be used as sessionid'
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        resource: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    return Sessions;
};
