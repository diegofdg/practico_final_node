const Sequelize = require('sequelize');
const db = require('../config/db');

const Libros = db.define('libros', {
    id_libro: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: Sequelize.STRING(40),
    descripcion: Sequelize.TEXT(300),    
    id_categoria: Sequelize.INTEGER(10),
    id_persona: Sequelize.INTEGER(10),
}, {
    hooks: {
        beforeCreate:(libro) => {
            libro.nombre = libro.nombre.toUpperCase().trim();
            libro.descripcion = libro.descripcion.toUpperCase().trim();
            libro.id_categoria = libro.id_categoria.trim();
            libro.id_persona = libro.id_persona.trim();            
        }
    }
});

module.exports = Libros;