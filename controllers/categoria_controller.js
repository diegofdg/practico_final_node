const express = require('express');
const app=express();
const util= require('util');
const conn=require('../conexion');


conn.connect((error)=>{
    if(error) throw error;
    console.log('Conexion Establecida');
});
let query=util.promisify(conn.query).bind(conn);

exports.getCategory=async function(req,res){
    try
    {
        await query('SELECT * FROM tbl_categoria ORDER BY id_categoria',(error,regs,fields)=>{
            if(error){
                res.status(413).send({'mje':'Error inesperado'});
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
    catch(e){
        res.status(413).send({'mje':'Error inesperado. '+e});
    }
}
