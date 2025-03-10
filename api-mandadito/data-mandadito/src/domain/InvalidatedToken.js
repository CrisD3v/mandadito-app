const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
   'InvalidatedToken', {
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true
});
};