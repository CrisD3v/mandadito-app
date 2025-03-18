const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "Order",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            starting_point: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            drop_off_point: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            state: {
                type: DataTypes.ENUM('queue_', 'pending_', 'picking_', 'delivering_', 'delivered_'),
                allowNull: false,
                defaultValue: 'queue_'
            },
            active_search: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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