const { raw } = require('body-parser');

const Personas = require('../models/Personas');
const Libros = require('../models/Libros');

const personasController = {};

// Listar todas las personas
personasController.personasGetAll = async(req, res, next) => {
    try {
        const result = await Personas.findAll();        
        if (result.length === 0) {
            res.status(413).json({
                'Error': 'No Existen Personas registradas'
            });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
};

// Buscar una persona por id
personasController.personaGetId = async(req, res, next) => {
    try {
        //Capturamos el id
        const { id } = req.params;    
        
        //Verificamos que id sea un número
        if(!parseInt(id,10)){
            throw new Error('Se esperaba un Numero.');
        }     
        //Consultamos 
        const result = await Personas.findAll({
            where: {
                id
            }
        });        
        if (result.length === 0) {
            return res.status(413).json({
                'Error':'Persona No Encontrada' 
            });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
}

// Crear una persona
personasController.personaAdd = async(req, res, next) => {
    try {        
        // Valido nombre tenga contenido y sea STRING
        if(!req.body.nombre || typeof req.body.nombre === undefined || !/[a-z]+$/i.test(req.body.nombre.trim())){
            throw new Error('El nombre es obligatorio, debe contener solo letras y no puede estar vacío');
        }
        
        //Valido apellido tenga contenido y sea STRING
        if(!req.body.apellido || !/[a-z]+$/i.test(req.body.apellido.trim())){
            throw new Error('El apellido debe contener solo letras y no puede estar vacío');
        }

        //Valido alias tenga contenido y sea STRING
        if(!req.body.alias || !/[a-z]+$/i.test(req.body.alias.trim())){
            throw new Error('El alias debe contener solo letras y no puede estar vacío');
        }

        //Valido la estructura del email
        if(!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(req.body.email)){
            throw new Error('El email debe tener cierta estructura: ejemplo@ejemplo.com');
        }
        
        //Convierto los datos enviados por POST a mayusculas
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        const email = req.body.email.toUpperCase();

        //Verifico exista el email en la base de datos
        const verifEmail = await Personas.findAll({
            where: {
                email
            }
        });
        if (verifEmail.length == 0){
            // si el email no existe, inserto la persona
            const result = await Personas.create({
                nombre: nombre,
                apellido: apellido,
                alias: alias,
                email: email
            });            
            if (result.length === 0) {
                throw new Error('Hubo un error al intentar guardar la Persona');
                
            } else {
                res.status(200).json(result.dataValues);
            }
        } else {
            return res.status(413).json({
                'Error': 'El email ya se encuentra registrado' 
            });
        }
    } catch (error) {
        next(error);
    }
}

// Actualizar una persona por id
personasController.personaUpdateId = async(req, res, next) => {
    try {
        const { id } = req.params;

        //Verificamos que id sea un número
        if(!parseInt(id,10)){
            throw new Error('Se esperaba un Numero.');
        }     

        // buscamos el id capturado
        const result = await Personas.findByPk( id );
        
        if(!result){
            return res.status(413).json({'Error':'Persona No Encontrada'});
        } else {       
            // Valido nombre tenga contenido y sea STRING
            if(!req.body.nombre || typeof req.body.nombre === undefined || !/[a-z]+$/i.test(req.body.nombre.trim())){
                throw new Error('El nombre es obligatorio, debe contener solo letras y no puede estar vacío');
            }
            
            //Valido apellido tenga contenido y sea STRING
            if(!req.body.apellido || !/[a-z]+$/i.test(req.body.apellido.trim())){
                throw new Error('El apellido debe contener solo letras y no puede estar vacío');
            }

            //Valido alias tenga contenido y sea STRING
            if(!req.body.alias || !/[a-z]+$/i.test(req.body.alias.trim())){
                throw new Error('El alias debe contener solo letras y no puede estar vacío');
            }
            
            //Convierto los datos enviados por POST a mayusculas
            const nombre = req.body.nombre.toUpperCase();
            const apellido = req.body.apellido.toUpperCase();
            const alias = req.body.alias.toUpperCase();
            
            // si existe el id, tratamos de actualizarlo con los datos enviados por post            
            const actualizo = await Personas.update({
                nombre,
                apellido,
                alias                    
            }, {
                where: {
                    id
                }
            });                
            if (actualizo == 0) {                    
                throw new Error('Hubo un error al intentar actualizar la Persona');
            } else {      
                res.status(200).json({'Mensaje': 'Datos del id ' + id + ' actualizados.'});
            }           
        }
    } 
    catch(error){
        next(error)
    }
}

//Eliminar una persona por id
personasController.personaDeleteId = async(req, res,next) => {
    const { id } = req.params;    
    
    try {
        //Verificamos que id sea un número
        if(!parseInt(id,10)){
            throw new Error('Se esperaba un Numero.');
        }     
        let result = await Libros.findAll({
            where: {
                persona_id: id
            }
        }); 
        if (result.length > 0) {
            return res.status(413).json({
                "Error": "Esta Persona tiene libros asociados, no se puede borrar" 
            });   
        } 
        
        result = await Personas.destroy({
            where: {
                id
            }}
        ); 
        if(result == 0) { 
            res.status(413).json({
                'Error': 'Persona No Encontrada.' 
            });                        
        } else {
            res.status(200).json({'Mensaje': 'Persona Eliminada.'});            
        } 
    } catch(error){
        next(error)
    }
}

module.exports = personasController;