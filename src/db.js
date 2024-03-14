const {Sequelize} = require('sequelize');

const {DB_CONFIG} = require('./config/db-config');

const db = new Sequelize(DB_CONFIG);

module.exports = {db};
