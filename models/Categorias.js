const Sequelize = require('sequelize');
const db = require('../config/db');

const Categorias=db.define('categorias', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:Sequelize.STRING(30),
        allowNull:false,
        validate:{
            customF(value){
                if(value.trim()==''){throw new Error('Cadena Vacia');}
            }
        }
    }    
},{
    hooks:{
        beforeCreate:(categoria)=> {
            categoria.nombre=categoria.nombre.toUpperCase().trim();
        }
    }
});

module.exports = Categorias;