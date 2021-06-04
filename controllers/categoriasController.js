//Importamos las dependencias
const categorias=require('../models/Categorias');

// Controlador para listar todas las categorias - GET
exports.categoriaGet=async(req,res,next)=>{
    try{
        const result=await categorias.findAll(); 
        if(result!='')
        { 
            res.status(200).json(result);
        }
        else res.status(413).json(result);
        //else res.json(result).status(413);
    }
    catch(error){        
        next(error)
    }
}

// Controlador para buscar una categoria por id - GET
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

// Controlador para buscar una categoria por nombre - GET
// FALTA EXPORTARLO O ESTO SOBRA??
categoriaGetNombre=async(nombre)=>{
    if(nombre==null || nombre.trim()=='')   throw new Error('Se esperaba un Parametro Nombre:String.');
    const result=await categorias.findOne({where :{nombre}}); 
    return(result!=null?true:false);
}

// Controlador para crear una categoria - POST
exports.categoriaCreate=async(req,res,next)=>{
    try{
        //if(req.body.nombre==null || req.body.nombre.trim()=='')   throw new Error('Se esperaba un Parametro Nombre:String.');
        
        //validación de nombre: campo no vacío, no INT
        //Combino con la validación de arriba xq esa toma INT como válido
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

// Controlador para eliminar una categoria por id - DELETE
exports.categoriaDelete=async(req,res,next)=>{
    try{
        //Esta validación la sacaría...no se activa
        if(req.params.id==null)   throw new Error('Se esperaba un Parametro id:Int.');
        
        const id=req.params.id;
        if(!parseInt(id,10)) throw new Error('Se esperaba un Numero.');
        const result=await categorias.destroy({where :{id}}); 
        console.log(result);

        if(result==0)
        { 
            throw new Error('Categoria No Encontrada.');
        }
        
        //falta corroborar
        //
        //        
        //valida que la categoría no tenga ningún libro para eliminar      
        result=await categorias.destroy({FROM: {libro}, where :{id_categoria}});
        //query = "SELECT * FROM libro WHERE categoria_id = ?";
        //respuesta = await qy(query, [req.params.id]);

        if (result.length > 0) {
            throw new Error("Esta categoría tiene libros asociados, no se puede borrar");
        }
        else  res.json({'mensaje':'Se Borro Correctamente.'});
    }
    catch(error){
        next(error)
    }
}