const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('node-database', 'root', 'admin', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;