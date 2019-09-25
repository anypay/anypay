const Sequelize = require("sequelize");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgres://postgres:@127.0.0.1:5432/';
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: "postgres",
  operatorsAliases: false
});

module.exports = sequelize;
