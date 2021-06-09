const Sequelize = require('sequelize');
const db = require('../config/db');


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
    categoria_id:{
        type: Sequelize.INTEGER,
        name: 'FK_Libros_Categorias',
        references: {
          model: 'categorias',
          key: 'id'
        }},
    persona_id:{
            type: Sequelize.INTEGER,
            name: 'FK_Libros_Prestado_Persona',
            references: {
              model: 'personas',
              key: 'id'
            }
        }
   
    }        
, {
    hooks: {
        beforeCreate(libro) {
            const nombre = libro.nombre.toUpperCase().trim();            
            const descripcion = libro.descripcion.toUpperCase().trim();            
        }
    }
});
//nahuel-------------------------- END-

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