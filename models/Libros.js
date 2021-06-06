const Sequelize = require('sequelize');
const db = require('../config/db');

const Libros = db.define('libros', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(40),
    descripcion: Sequelize.STRING(300),
    id_categoria: Sequelize.INTEGER(11),
    id_persona: Sequelize.INTEGER(11),
}, {
    hooks: {
        beforeCreate(libro) {
            const nombre=libro.nombre.toUpperCase().trim();
            const descripcion=libro.descripcion.toUpperCase().trim();
            const id_categoria = libro.id_categoria.trim();
            const id_persona = libro.id_persona.trim();                        
        }
    }
});

module.exports = Libros;

/*























const Sequelize = require('sequelize');
const db = require('../config/db');

const Libros=db.define('libros', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:Sequelize.STRING(40)        
    },    
    descripcion:{
        type:Sequelize.TEXT(300)        
    },
    id_categoria:{
        type:Sequelize.INTEGER(10)        
    },
    id_persona:{
        type:Sequelize.INTEGER(10)
    }    
},{
    hooks:{
        beforeCreate:(libro)=> {
            libro.nombre=libro.nombre.toUpperCase().trim();
            libro.descripcion=libro.descripcion.toUpperCase().trim();
            libro.id_categoria = libro.id_categoria.trim();
            libro.id_persona = libro.id_persona.trim();            
        }
    }
});

module.exports = Libros;*/