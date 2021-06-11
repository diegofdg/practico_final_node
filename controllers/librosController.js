const libros = require('../models/Libros');
const categorias = require('../models/Categorias');
const personas = require('../models/Personas');

const librosController = {};

//Incorporar Nuevo Libro
librosController.libroAdd = async(req, res) => {
    try {
        const nombre = req.body.nombre.toUpperCase(); //toma el campo nombre traido del body y lo convierte a mayusculas      
        const descripcion = req.body.descripcion.toUpperCase(); //toma el campo descripcion traido del body y lo convierte a mayusculas            
        const categoria_id = req.body.categoria_id;      
        let persona_id = req.body.persona_id;           

        //verifica que la categoria no este vacia y el nombre tampoco este vacio
        if (categoria_id.trim()=='' || nombre.trim()==''  ){
            console.log('entro aca')
            return res.json({message: " - nombre y categoría son datos obligatorios -"});
        }
        //verifica que el campo categoriaId sea un dato valido
        if (!categoria_id ||  !/[0-9]+$/i.test(categoria_id.trim())){
            return res.json({message: "la categoría debe ser un valor numéricos"});
        }
       //busca la existencia de la categoria en la que se intenta incluir el libro
        
       const verifCategoria = await categorias.findAll({where:{id:categoria_id}});
        
        if (verifCategoria.length =='' ) {
            return res.json({message: " - no existe la categoria indicada -"});
        }
        //si el libro se ingresa sin datos de personaId el valor de personaId se carga en null
        if (persona_id.trim() ==='') {
            persona_id = null;
        }else { //si el dato de persona_id no es vacio se realiza la comprobacion de que persona_id sea un dato valido (numerico)
            if (!persona_id ||  !/[0-9]+$/i.test(persona_id.trim())){
                return res.json({message: "la persona debe ser un valor numérico"}); 
            } else {// verifica que la persona exista en la tabla personas validando personaId en la tabla
                const verifPersona = await personas.findAll({where:{id:persona_id}});
                    if ( verifPersona.length === 0 ){//|| verifPersona.result == null    )   {
                    return res.json({message: " - no existe la persona indicada -"});
                }
            }
        }       
        // valida la existencia del libro a incorporar buscando en la tabla libros si existe un libro con ese nombre y categoria
        const verifNombreyCat = await libros.findAll({where:{nombre,categoria_id}});   
        if ( verifNombreyCat.length == 0) { //si no encuentra una coincidencia de libro y categoria se procede a incorporar el libro
            const result = await libros.create({
                nombre: nombre,
                descripcion:descripcion,
                categoria_id:categoria_id,
                persona_id:persona_id
            });
            console.log("resultado Incorporación", result.length);
                if (result.length === 0) {
                    return res.status(413).json({ message: 'Error: No se ha podido incorporar el nuevo Libro' });
                } else {
                    return res.status(200).json({ message: 'Libro registrado', result });
                }              
        } 
        else {
            return res.status(413).json({ message: ' - ese libro ya existe -' });
        }
    } catch (err) {
        res.json(err);
    }
}

//prestar libro por id,  cargando en el campo personaId de libro el id de persona
librosController.libroPrestar = async(req, res) => {      
    const { id } = req.params;    

    const persona_id = req.body.persona_id; //tomo el id de la persona a la que se le presta el libro y que pasa por el body como param
    if  (persona_id ==""|| !/[0-9]+$/i.test(persona_id.trim())){// verifica que el id de la persona a la que se presta no sea vacio ni distinto de numero
        return res.json({ message: ' - ingrese un dato valido -' });
    }
    let result = await personas.findByPk(  persona_id );  //consulto la existencia de la persona 
        
    if (!result) { //si el resultado es vacio la persona no existe en la bd con ese id
        return res.status(413).json({ message: ' - no se encontro la persona a la que se quiere prestar el libro -' });
    }

        //si el resultado de buscar a la persona por el id es verdadero procedo a la busqueda de la existencia del libro por id
    result = await libros.findByPk( id );              //busca el id del libro pasado en la url
        
    if (!result) { //si el resultado de la busqueda es falso mostrara el mensaje de no se encontro el libro
        return res.status(413).json({ message: ' - no se encontro el libro -' });
    }    // en caso de que la busqueda del libro por id sea verdadera  se continua y se verifica que no este prestado
    if (result.persona_id != null) { // si el campo personaId del libro buscado no es null entonces el libro esta prestado
        return res.status(413).json({ message: ' - el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva -' });
    }
    else { // si el campo personaId es null procede a realizar el update del campo personaId 
        try {                
            const update = await libros.update({
                persona_id: persona_id},
                    {where: {id: id}
            });                                            
            console.log(update[0]);  
            if (update === 0) {                    
                return res.status(404).json({ message: ' - no se actualizaron los datos -' });
            } else {                    
                return res.status(200).json({ message: ' - se presto correctamente - ' });
            }
        } catch (err) {
            res.json(err,{message});
        }
    }
};

// devolver libro por id
librosController.libroDevolver = async(req, res) => {
    const { id } = req.params;    
        
    if  (id ==""|| !/[0-9]+$/i.test(id.trim())){// verifica que el id del libro a devolver sea numerico y no vacio
        return res.json({ message: ' - ingrese un dato valido -' });
    }
    const result = await libros.findByPk(id);  //consulto la existencia del libro
        
    if (!result) { //si el resultado es vacio el libro no existe en la bd con ese id
        return res.json({ message: ' - ese libro no existe -' });
    }        
         
    if (result.persona_id != null) { // si el campo personaId del libro buscado no es null entonces el libro esta prestado
        try{
            const update = await libros.update({
                persona_id:null}, //se realiza el update poniendo en null el campo persona _id
                    {where: {id: id}                
                });    
            console.log(update[0]);  
            if (update === 0) {                    
                return res.status(404).json({ message: ' - no se actualizaron los datos -' });
            } else {                    
                return res.status(200).json({ message: ' - se realizo la devolucion correctamente - ' });
            }
            }catch (err) {
                res.status(413).json(err,  ' - error inesperado - ');
            }
    } else { // si el campo personaId era null no estaba prestado el libro
        return res.json({ message: ' - el libro no estaba prestado! -' });                
    }              
};

//Actualiza descripcion del libro por id
librosController.libroUpdateDescripcionPorId = async(req, res) => {
    const { id } = req.params;
    const result = await libros.findByPk( id );        
    if (!result) {
        return res.status(404).send({ message: ' - no existe el id solicitado -' });
    }           
           // const nombre = req.body.nombre;
    const descripcion = req.body.descripcion.toUpperCase(); 
           // const categoriaId = req.body.categoriaId;                
    try {
        const update = await libros.update({
        descripcion: descripcion                
        }, 
        {
            where: {
                id: id
            }
        });
        console.log(update[0]);
        if (update == 0) {                    
            return res.status(413).json({ message: ' - no se actualizaron los datos -' });
        } else {                    
            return res.status(200).json({ message:'id: ' + id + ' - modificado - ', result });
        }
    } catch (err) {
        res.json(err);
    }
}


//eliminar libro por id
librosController.DeleteLibro= async(req,res) => {
    const { id } = req.params;        
    if(!id || !/[0-9]+$/i.test(id.trim())){ //verifica que el id pasado sea numerico
        return res.status(413).json({ message:'-se esperaba un parametro id:Int.'});
    }
    let result=await libros.findByPk(id);// busca si existe el libro con el id suministrado
    if (!result) { //si el resultado es vacio el libro no existe en la bd con ese id
        return res.status(404).json({ message: ' - ese libro no existe -' });
    }
    if (result.persona_id ==null){// si personaId es null el libro no se encuentra prestado y por lo tanto puede ser eliminado
        try{                                
            result=await libros.destroy({ //realiza el delete de libro donde por id
                where:{id}
            });
        }catch(err){
            res.json(err,  ' - error inesperado - ');
        }  
    }
    if(result > 0){              //si result es mayor a 0 la operacion fue exitosa
        return res.status(200).json({ message:' - se borro correctamente -'});
    }        
    else {
        return res.status(413).json({message:'- ese libro esta prestado, no se puede borrar ' });
        }
    }
    
                       
librosController.libroGetAll = async(req, res) => {
    try {
        const result = await libros.findAll();

        if (result.length === 0) {
            return res.status(404).json({ message: 'No hay libros registradas' });
        } else {
            return res.json(result).status(200);
        }
    } catch (err) {
        res.json(err);
    }
};
//obtiene libro por id
librosController.libroGetId = async(req, res) => {
    try {
        //Capturamos el id
        const { id } = req.params;
        console.log('Id: ', id);
        //consultamos 
        const result = await libros.findAll({ where: { id } });
        console.log('Result: ', result[0]);
        if (result.length === 0) {
            return res.status(413).json({ message: 'No se encuentra ese libro' });
        } else {
            return res.status(200).json(result[0]);
        }
    } catch (err) {
        res.json('Error inesperado', err);
    }
}
module.exports = librosController;
