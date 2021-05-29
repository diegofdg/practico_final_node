const express=require('express');
const app=express();
const port=3000;
const conn=require('./conexion/conexion');
const routes =require('./routes/routes');

conn.connect((error)=>{
    if(error) throw error;
    console.log('Conectado a la Base de Datos');
});

app.use(express.json());

app.use('/', routes);

//Servidor
app.listen(port,(req,res)=>{
    console.log('Servidor escuchando puerto '+port);
});
