const Sequelize = require('sequelize');
const db = require('../config/db');
const Categorias = require("./Categorias");
const Personas = require("./Personas");


const Libros = db.define('libros', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
//nahuel-------------------------- BEGIN-
    nombre:{
        type: Sequelize.STRING(40),
        allowNull:false,
        validate:{
            customF(value){
                if(value.trim()==''){throw new Error('Cadena Vacia');}
            }
        }
    },
    descripcion:{
            type: Sequelize.STRING(254),
            allowNull:false,
            validate:{
                customF(value){
                    if(value.trim()==''){throw new Error('Cadena Vacia');}
                }
            }        
    },   
}, {
    hooks: {
        beforeCreate(libro) {
            libro.nombre = libro.nombre.toUpperCase().trim();            
            libro.descripcion = libro.descripcion.toUpperCase().trim();            
        }
    }
});
//nahuel-------------------------- END-

//Creo las relaciones con categorias y personas
Libros.belongsTo(Personas); //personaId
Libros.belongsTo(Categorias); //categoriaId

module.exports = Libros;
