//Importamos las dependencias
const categorias=require('../models/Categorias');
const libros=require('../models/Libros');

// Controlador para listar todas las categorias - GET - FUNCIONA OK
exports.categoriaGet=async(req,res,next)=>{
    try{
        const result=await categorias.findAll(); 
        if(result!='')
        { 
            res.status(200).json(result);
        }
        else res.status(413).json(result);        
    }
    catch(error){        
        next(error)
    }
}

// Controlador para buscar una categoria por id - GET - FUNCIONA OK
exports.categoriaGetId=async(req,res,next)=>{
    try{
        if(req.params.id==null)   throw new Error('Se esperaba un Parametro id:Int.');
        const id=req.params.id;
        if(!parseInt(id,10)) throw new Error('Se esperaba un Numero.');
        const result=await categorias.findOne({where :{id}}); 
        if(result!=null)
        { 
            res.json(result);
        }
        else  throw new Error('Categoria No Encontrada.');
    }
    catch(error){
        next(error)
    }
}

// Metodo para verificar si existe una categoria con ese nombre - FUNCIONA OK
categoriaGetNombre=async(nombre)=>{
    if(nombre==null || nombre.trim()=='')   throw new Error('Se esperaba un Parametro Nombre:String.');
    const result=await categorias.findOne({where :{nombre}}); 
    return(result!=null?true:false);
}

// Controlador para crear una categoria - POST - FUNCIONA OK
exports.categoriaCreate=async(req,res,next)=>{
    try{        
        if(!req.body.nombre || !/[a-z]+$/i.test(req.body.nombre.trim())){
            throw new Error("El nombre debe contener solo letras y no puede estar vacío");
        }

        const nombre=req.body.nombre.trim();

        if(await categoriaGetNombre(nombre)) throw new Error('La Categoria ya se encuentra Ingresada.');

        result=await categorias.create({nombre :nombre}); 
        if(result!=null){
            res.json(result.dataValues);
        }
        else throw new Error('Error Inesperado.');
    }
    catch(error){
        next(error)
    }
}

// Controlador para eliminar una categoria por id - DELETE - FUNCIONA OK
exports.categoriaDelete=async(req,res,next)=>{
    try{
        //Esta validación la sacaría...no se activa
        if(req.params.id==null)   throw new Error('Se esperaba un Parametro id:Int.');
        
        const id=req.params.id;
        if(!parseInt(id,10)) throw new Error('Se esperaba un Numero.');

        //valida que la categoría no tenga ningún libro para eliminar  
        let result=await libros.findAll({
            where: {
                categoriaId: id
            }
        }); 
        console.log(result);

        if (result.length > 0) {
            throw new Error("Esta categoría tiene libros asociados, no se puede borrar");
        } 
        
        result=await categorias.destroy({
            where: {
                id
            }}
        ); 
        console.log(result);

        if(result==0)
        { 
            throw new Error('Categoria No Encontrada.');
        } else {
            res.json({'mensaje':'Se Borro Correctamente.'});
        } 
    }
    catch(error){
        next(error)
    }
}