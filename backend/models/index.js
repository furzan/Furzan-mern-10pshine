const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_connect');

const db = {};

db.Sequelize = sequelize.constructor;
db.sequelize = sequelize;


db.User = require('./user_model')(sequelize, DataTypes)


module.exports = db