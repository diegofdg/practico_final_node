//Importamos las dependencias
const Categorias = require('../models/Categorias');
const Libros = require('../models/Libros');

// Listar todas las categorias
exports.categoriaGet = async(req,res,next) => {
    try{
        const result = await Categorias.findAll(); 
        if(result != ''){ 
            res.status(200).json(result);
        } else {
            res.status(413).json({
                'Error': 'No Existen Categorías Cargadas' 
            });        
        }
    }
    catch(error){        
        next(error)
    }
}

// Buscar una categoria por id
exports.categoriaGetId = async(req,res,next) => {
    try{
        if(req.params.id == null){
            throw new Error('Se esperaba un Parámetro id:Int.');
        }
        const id = req.params.id;
        if(!parseInt(id,10)){
            throw new Error('Se esperaba un Numero.');
        } 
        const result = await Categorias.findOne({
            where :{
                id
            }
        }); 
        if(result != null){ 
            res.status(200).json(result);
        } else {
            res.status(413).json({
                'Error':'Categoría No Encontrada' 
            });
        } 
    }
    catch(error){
        next(error)
    }
}

// Metodo para verificar si existe una categoria con ese nombre
categoriaGetNombre = async(nombre) => {
    if(nombre==null || nombre.trim()==''){
        throw new Error('Se esperaba un Parametro Nombre:String.');
    }   
    const result = await Categorias.findOne({
        where :{
            nombre
        }
    }); 
    return (result != null ? true : false);
}

// Crear una categoria
exports.categoriaCreate = async(req,res,next) => {
    try{        
        if(!req.body.nombre || !/[a-z]+$/i.test(req.body.nombre.trim())){
            throw new Error('El nombre debe contener solo letras y no puede estar vacío');
        }
        const nombre = req.body.nombre.trim();
        if(await categoriaGetNombre(nombre)){            
            res.status(413).json({
                'Error': 'La Categoría ya se encuentra registrada' 
            });
            return;
        }
        result = await Categorias.create({
            nombre
        }); 
        if(result != null){
            res.status(200).json(result.dataValues);
        } else {
            throw new Error('Hubo un error al intentar guardar la categoría');
        }
    }
    catch(error){
        next(error);
    }
}

// Eiminar una categoria por id
exports.categoriaDelete = async(req,res,next) => {
    try{        
        const id = req.params.id;
        if(!parseInt(id,10)){
            throw new Error('Se esperaba un Numero.');
        } 
        //valida que la categoría no tenga ningún libro para eliminar  
        let result = await Libros.findAll({
            where: {
                categoria_id: id
            }
        });
        if(result.length > 0){
            res.status(413).json({
                "Error": "Esta categoría tiene libros asociados, no se puede borrar" 
            });     
            return;       
        }         
        result = await Categorias.destroy({
            where: {
                id
            }}
        ); 
        if(result == 0) { 
            res.status(413).json({
                'Error': 'Categoría No Encontrada.' 
            });                        
        } else {
            res.status(200).json({'Mensaje': 'Categoría Eliminada.'});            
        } 
    }
    catch(error){
        next(error)
    }
}