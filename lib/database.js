const Sequelize = require("sequelize");
//postgres://postgres:ok@127.0.0.1/anypay
/*
host: anypay-payment-service-development.cdzfkderlkpp.us-east-1.rds.amazonaws.com
port: 5432
user: anypay_dash
password: 424d74846a14c7f9c5ef3135390384c3
database: anypay_dash
url: postgres://anypay_dash:424d74846a14c7f9c5ef3135390384c3@anypay-payment-service-development.cdzfkderlkpp.us-east-1.rds.amazonaws.com:5432/anypay_dash
*/
const sequelize = new Sequelize('postgres://anypay_dash:424d74846a14c7f9c5ef3135390384c3@anypay-payment-service-development.cdzfkderlkpp.us-east-1.rds.amazonaws.com:5432/anypay_dash', {
  logging: false,
  dialect: "postgres"
});

module.exports = sequelize;
