const util= require('util');
const conn=require('../conexion/conexion');
const query=util.promisify(conn.query).bind(conn);

exports.setCategory=async (req,res) => {
    try 
    {
        if (!req.body.nombre) {
            res.status(413).send("Faltan datos");
            return;
        }

        let nombreCategoria = req.body.nombre;
        let sql = 'SELECT id_categoria FROM tbl_categoria WHERE nombre_categoria = ? ORDER BY id_categoria';
        let respuesta = await query(sql, [nombreCategoria.toUpperCase()]);

        if (respuesta.length > 0) { 
            res.status(413).send('Ese nombre de categoria ya existe');
        }      

        sql = 'INSERT INTO tbl_categoria (nombre_categoria) VALUE (?)';
        respuesta = await query(sql, [nombreCategoria.toUpperCase()]);    

        res.status(200).send({
            'id_cateroria:': respuesta.insertId,
            'nombre_categoria': nombreCategoria.toUpperCase()
        });
    }   
    catch(e){        
        res.status(413).send({"Error inesperado": e.message});
    }
};    

exports.getAllCategories=async (req,res) => {
    try
    {
        const sql = 'SELECT * FROM tbl_categoria ORDER BY id_categoria';
        await query(sql,(error,regs,fields)=>{
            if(error){
                res.status(413).send({"Error inesperado": e.message});
                return;
            }

            if(regs.length>0){
                res.status(200).send(regs);
            }
            else {
                res.status(413).send(regs);
            }            
        });
    }
    catch(e)
    {
        res.status(413).send({"Error inesperado": e.message});
    }
}

exports.getCategory=async (req,res) => {
    try
    {
        const sql = 'SELECT * FROM tbl_categoria WHERE id_categoria = ?';
        await query(sql,[req.params.id],(error,regs,fields)=>{
            if(error){
                res.status(413).send({"Error inesperado": e.message});
                return;
            }

            if(regs.length>0){
                res.status(200).send(regs);
            }
            else {
                res.status(413).send('Categoria no encontrada');
            }            
        });
    }
    catch(e)
    {
        res.status(413).send({"Error inesperado": e.message});
    }
}

exports.removeCategory=async (req,res) => {
    try 
    {
       let sql = 'SELECT * FROM tbl_libro WHERE fk_categoria = ?';
       let respuesta = await query(sql, [req.params.id]);

       if (respuesta.length > 0) {
            res.status(413).send("Esta categoria tiene libros asociados, no se puede borrar");
            return;           
       }

       sql = 'DELETE FROM tbl_categoria WHERE id_categoria = ?';
       respuesta = await query(sql, [req.params.id]);    
          
       if (respuesta.affectedRows==0) {
            res.status(413).send("Categoria no encontrada");
            return;                       
        } else {
            res.status(200).send("La categoria seleccionada se ha borrado correctamente");
        }                                    
    }
    catch(e)
    {       
       res.status(413).send({"Error inesperado": e.message});
   }
};

