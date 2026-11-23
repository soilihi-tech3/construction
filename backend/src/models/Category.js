const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  boutiqueId: { type: DataTypes.INTEGER, allowNull: false },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  famille: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  icone: { type: DataTypes.STRING(50), allowNull: true },
  ordre: { type: DataTypes.INTEGER, defaultValue: 0 },
  imageUrl: { type: DataTypes.TEXT("long"), allowNull: true },
}, { tableName: "categories" });

module.exports = Category;
