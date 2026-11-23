const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  boutiqueId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
  nom: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  prix: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  prixPromo: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  prixSenegal: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: "prix_senegal" },
  prixPromoSenegal: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: "prix_promo_senegal" },
  prixParDevise: { type: DataTypes.JSON, allowNull: true, field: "prix_par_devise" },
  prixPromoParDevise: { type: DataTypes.JSON, allowNull: true, field: "prix_promo_par_devise" },
  creeParId: { type: DataTypes.INTEGER, allowNull: true, field: "cree_par_id" },
  enPromo: { type: DataTypes.BOOLEAN, defaultValue: false },
  dateExpiration: { type: DataTypes.DATEONLY, allowNull: true },
  famille: { type: DataTypes.STRING(100), defaultValue: "Cosmétique" },
  poids: { type: DataTypes.STRING(50), defaultValue: "1" },
  unite: { type: DataTypes.STRING(50), defaultValue: "pièce" },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  seuilAlerte: { type: DataTypes.INTEGER, defaultValue: 5 },
  coutAchat: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  fournisseurId: { type: DataTypes.INTEGER, allowNull: true },
  imageUrl: { type: DataTypes.TEXT("long"), allowNull: true },
  imageUrl2: { type: DataTypes.TEXT("long"), allowNull: true },
  ventesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isNouveau: { type: DataTypes.BOOLEAN, defaultValue: false },
  noteEtoiles: { type: DataTypes.DECIMAL(2, 1), defaultValue: 5.0 },
  genre: { type: DataTypes.STRING(20), defaultValue: "femme" }, // 'femme' | 'homme' | 'mixte'
  etat: { type: DataTypes.STRING(20), defaultValue: "neuf" }, // rétrocompatibilité
  marqueId: { type: DataTypes.INTEGER, allowNull: true, field: "marque_id" },
  masquerSurSite: { type: DataTypes.BOOLEAN, defaultValue: false, field: "masquer_sur_site" },
  images: { type: DataTypes.JSON, allowNull: true },
  couleurs: { type: DataTypes.JSON, allowNull: true },
  senteurs: { type: DataTypes.JSON, allowNull: true },
  typeVarianteNom: { type: DataTypes.STRING(50), defaultValue: "Senteur", field: "type_variante_nom" },
  modelesCompatibles: { type: DataTypes.JSON, allowNull: true, field: "modeles_compatibles" },
  isPrixFixe: { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_prix_fixe" },
  disponibilite: { type: DataTypes.STRING(30), defaultValue: "en_stock" }, // 'en_stock' | 'sur_commande'
  delaiCommande: { type: DataTypes.STRING(100), defaultValue: "1 à 2 semaines aux Comores", field: "delai_commande" },
  volume: { type: DataTypes.STRING(50), allowNull: true }, // ex: "8 m³", "25 kg", "12 m"
  isRecommande: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_recommande" },
  isPlusVendu: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_plus_vendu" },
}, { tableName: "products" });

module.exports = Product;
