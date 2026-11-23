const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Service = sequelize.define(
  "Service",
  {
    boutiqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    conditions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tarif: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Sur devis gratuit",
    },
    typeTarif: {
      type: DataTypes.STRING(50),
      defaultValue: "devis", // 'devis' | 'journee' | 'm2' | 'forfait' | 'prix_fixe'
      field: "type_tarif",
    },
    chefNom: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "chef_nom",
    },
    chefTelephone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "chef_telephone",
    },
    chefEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "chef_email",
    },
    imageUrl: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      field: "image_url",
    },
    photosRealisation: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "photos_realisation",
    },
    ordre: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "services",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Service;

