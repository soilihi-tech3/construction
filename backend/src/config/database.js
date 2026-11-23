require("dotenv").config();
const { Sequelize } = require("sequelize");

const dbHost = (process.env.DB_HOST || "127.0.0.1").trim();
const isSSL = process.env.DB_SSL === "true" || dbHost.includes("tidbcloud.com");
// Si DB_PASSWORD est vide (XAMPP par défaut sans mot de passe), ne pas utiliser de mot de passe par défaut
const dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "";

const sequelize = new Sequelize(
  (process.env.DB_NAME || "constructiondb").trim(),
  (process.env.DB_USER || "root").trim(),
  dbPassword,
  {
    host: dbHost,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    dialect: "mysql",
    logging: false,
    dialectOptions: isSSL
      ? {
          ssl: {
            minVersion: "TLSv1.2",
            rejectUnauthorized: false,
          },
        }
      : {},
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

module.exports = sequelize;
