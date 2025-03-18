const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "CodeOrder",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            code: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            entries: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
};