const categorias=require('../models/Categorias');


exports.categoriaGet=async(req,res,next)=>{
    try{
        const result=await categorias.findAll(); 
        if(result!='')
        { 
            res.json(result);
        }
        else res.status(413).json(result);
        //else res.json(result).status(413);
    }
    catch(error){
        next(error)
    }
}

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

categoriaGetNombre=async(nombre)=>{
    if(nombre==null || nombre.trim()=='')   throw new Error('Se esperaba un Parametro Nombre:String.');
    const result=await categorias.findOne({where :{nombre}}); 
    return(result!=null?true:false);
}


exports.categoriaCreate=async(req,res,next)=>{
    try{
        if(req.body.nombre==null || req.body.nombre.trim()=='')   throw new Error('Se esperaba un Parametro Nombre:String.');
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

exports.categoriaDelete=async(req,res,next)=>{
    try{
        if(req.params.id==null)   throw new Error('Se esperaba un Parametro id:Int.');
        const id=req.params.id;
        if(!parseInt(id,10)) throw new Error('Se esperaba un Numero.');
        const result=await categorias.destroy({where :{id}}); 
        console.log(result);
        if(result)
        { 
            throw new Error('Categoria No Encontrada.');
        }
        else  res.json({'mensaje':'Se Borro Correctamente.'});
    }
    catch(error){
        next(error)
    }
}