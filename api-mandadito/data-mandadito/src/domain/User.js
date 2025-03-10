const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            identification: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            phone: {
                type: DataTypes.STRING, // Changed to STRING for better phone number handling
                allowNull: false,
                unique: true,
                validate: {
                    is: /^\+?[1-9]\d{1,14}$/ // Validates international phone number format
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            verify: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
};
