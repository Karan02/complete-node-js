const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-database', 'root', 'admin', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
