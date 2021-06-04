//Importamos las dependencias
const categorias=require('../models/Categorias');

exports.libroGetAll = async(req, res) => {

    try {

        const result = await personas.findAll();
        if (result.length === 0) {
            throw new Error("No hay personas registradas");
        }
        res.status(200).json({"Los libros prestados son": result});

    }
    catch (e) {
        console.error(e.message);
        res.status(413).json({ "Message": e.message });
    }

}

exports.libroGetId = async(req, res) => {

    try {

        const id = req.params.id;

        const result = await libros.findOne({where: {id}});
        if (result.length === 0) {
            throw new Error("Este libro no existe");
        }
        res.status(200).json({"El libro que busca es": result});

    }
    catch (e) {
        console.error(e.message);
        res.status(413).json({ "Message": e.message });
    }

}

exports.libroCreate = async(req, res) => {

    try {
        
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        const id_categoria = req.body.id_categoria;
        const id_persona = req.body.id_persona;

        if (!req.body.nombre || !req.body.categoria_id) {
            throw new Error("Falta enviar datos");
        }

        //validacion nombre = tenga contenido y sea string
        if(req.body.nombre.length === 0 || !/[a-z]+$/i.test(req.body.nombre.trim())){
            throw new Error("El nombre debe contener solo letras y un solo espacio"); 
        }
        
        //validación de no existencia de nombre        
        if(await libroGetAll(nombre)){
            throw new Error("El libro ya existe");
        }        

        //validación de id_categoria = número
        if (isNaN(id_categoria)) {
            throw new Error("La categoría ingresada tiene que ser un número");
        }

        if (isNaN(id_persona)) {
            throw new Error("La persona ingresada tiene que ser un número");
        }  
        
        result = await libros.create(
            {
                nombre,
                descripcion,
                id_categoria,
                id_persona,
            });
        
        console.log(result);
        res.status(200).json({"Los datos del libro ingresado son": result});

    }
    catch (e) {
        console.error(e.message);
        res.status(413).json({ "Message": e.message });
    }
};