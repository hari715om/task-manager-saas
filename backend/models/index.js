const sequelize = require('../config/db');
const User = require('./user');
const Task = require('./task');

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Task };
