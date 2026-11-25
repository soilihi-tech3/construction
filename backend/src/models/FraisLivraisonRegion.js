const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FraisLivraisonRegion = sequelize.define(
  "FraisLivraisonRegion",
  {
    id: { type: DataTypes.INTEGER, primaryEvent: true, primaryKey: true, autoIncrement: true },
    boutiqueId: { type: DataTypes.INTEGER, allowNull: false, field: "boutique_id" },
    region: { type: DataTypes.STRING(150), allowNull: false },
    sousRegions: { type: DataTypes.TEXT, allowNull: true, field: "sous_regions" },
    prixKmf: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: "prix_kmf" },
    delaiEstime: { type: DataTypes.STRING(100), defaultValue: "24h à 48h", field: "delai_estime" },
    actif: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "frais_livraison_regions",
    timestamps: true,
    underscored: true
  }
);

module.exports = FraisLivraisonRegion;
