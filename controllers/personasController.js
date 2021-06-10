const { raw } = require('body-parser');

const personas = require('../models/Personas');
const libros=require('../models/Libros');

const personasController = {};

//Muestra todas las personas registradas
personasController.personasGetAll = async(req, res) => {
    try {
        const result = await personas.findAll();

        if (result.length === 0) {
            return res.status(404).json({ message: 'No hay personas registradas' });
        } else {
            return res.json(result).status(200);
        }
    } catch (err) {
        res.status(413).json(err);
    }
};

//Muestra personas por id
personasController.personaGetId = async(req, res) => {
    try {
        //Capturamos el id
        const { id } = req.params;
        console.log('Id capturado: ', id);
        //consultamos 
        const result = await personas.findAll({ where: { id } });
        console.log('Result: ', result[0]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'No existe el id solicitado' });
        } else {
            return res.status(200).json(result[0]);
        }
    } catch (err) {
        res.status(413).json(err);
    }
}

//Agrega persona
personasController.personaAdd = async(req, res) => {

    try {
        
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        const email = req.body.email.toUpperCase();

                
        //Valido nombre tenga contenido y sea STRING
        if(!nombre || !/[a-z]+$/i.test(nombre.trim())){
            return res.json({message: "El nombre debe contener solo letras y no puede estar vacío"});
        }
        
        //Valido apellido tenga contenido y sea STRING
        if(!apellido || !/[a-z]+$/i.test(apellido.trim())){
            return res.json({message: "El apellido debe contener solo letras y no puede estar vacío"});
        }

        //Valido alias tenga contenido y sea STRING
        if(!alias || !/[a-z]+$/i.test(alias.trim())){
            return res.json({message: "El alias debe contener solo letras y no puede estar vacío"});
        }

        if(!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)){
            return res.json({message: "El email debe tener cierta estructura: ejemplo@ejemplo.com"});
        }

        //Verifico exista el email en la base de datos
        const verifEmail = await personas.findAll({ where: { email } });

        if (verifEmail.length == 0) {
            // si el email no existe, inserto la persona
            const result = await personas.create({
                nombre: nombre,
                apellido: apellido,
                alias: alias,
                email: email
            });
            console.log("resultado creacion", result.length);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Error: No se ha podido realizar la registracion' });
            } else {
                return res.status(200).json({ message: 'Persona registrada', result });
            }
        } else {
            return res.status(404).json({ message: 'Error: El email ya se encuentra registrado' });
        }
    } catch (err) {
        res.status(413).json(err);
    }
}

//Actualiza persona por id
personasController.personaUpdateId = async(req, res) => {

    try {
        const { id } = req.params;
        // buscamos el id capturado
        const result = await personas.findByPk( id );
        
        if (!result) {
            return res.status(404).send({ message: 'No existe el id solicitado' });
        } else {
            
            //Capturamos datos enviados por post
            const nombre = req.body.nombre;
            const apellido = req.body.apellido;
            const alias = req.body.alias;

            //Valido nombre tenga contenido y sea STRING
            if(!nombre || !/[a-z]+$/i.test(nombre.trim())){
                return res.json({message: "El nombre debe contener solo letras y no puede estar vacío"});
            }
        
            //Valido apellido tenga contenido y sea STRING
                if(!apellido || !/[a-z]+$/i.test(apellido.trim())){
                return res.json({message: "El apellido debe contener solo letras y no puede estar vacío"});
            }

            //Valido alias tenga contenido y sea STRING
            if(!alias || !/[a-z]+$/i.test(alias.trim())){
                return res.json({message: "El alias debe contener solo letras y no puede estar vacío"});
            }
            
            // si existe el id, tratamos de actualizarlo con los datos enviados por post
            try {
                const actualizo = await personas.update({
                    nombre: nombre,
                    apellido: apellido,
                    alias: alias
                    //email // no se puede modificar
                }, {
                    where: {
                        id: id
                    }
                });
                console.log(actualizo[0]);
                if (actualizo == 0) {
                    
                    return res.status(404).json({ message: 'No hubo actualización de datos' });
                } else {
                    
                    return res.status(200).json({ message:'Datos del id ' + id + ' actualizados.' });
                }
            } catch (err) {
                res.json(err);
            }
            //return res.send(result).status(200);
        }
    } catch (err) {
        res.status(413).json(err);
    }

}

//Elimina persona por id
personasController.personaDeleteId = async(req, res,next) => {
    const { id } = req.params;    
    try {
        let result=await libros.findAll({
            where: {
                personaId: id
            }
        }); 
        //console.log(result);

        if (result.length > 0) {
            throw new Error("Esta persona tiene libros asociados, no se puede borrar");
        } 
        
        result=await personas.destroy({
            where: {
                id
            }}
        ); 
        console.log('el resultado');
        console.log(result);

        if(result==0)
        { 
            throw new Error('Persona No Encontrada.');
        } else {
            res.json({'mensaje':'Se Borro Correctamente.'});
        } 
    } catch(error){
        next(error)
    }
}

module.exports = personasController;