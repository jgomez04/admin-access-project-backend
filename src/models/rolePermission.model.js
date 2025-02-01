const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RolePermission = sequelize.define('roles_permisos', {
    rol_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' } },
    permiso_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'permisos', key: 'id' } }
}, {
    timestamps: false,
    tableName: 'roles_permisos',
});

module.exports = RolePermission;