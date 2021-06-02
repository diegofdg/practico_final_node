const Sequelize = require('sequelize');
const db = require('../config/db');

const Libros = db.define('libros', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(40),
    descripcion: Sequelize.TEXT,
    fkCategoria: Sequelize.INTEGER,
    fkPersona: Sequelize.INTEGER,
}, {
    hooks: {
        beforeCreate(libro) {
            const nombre = libro.nombre.toUpperCase().trim();
        }
    }
});

module.exports = Libros;