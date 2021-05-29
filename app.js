const express=require('express');
const app=express();
const port=3000;

var routes =require('./routes/routes');
app.use('/', routes);

//Servidor
app.listen(port,(req,res)=>{
    console.log('Servidor escuchando puerto'+port);
});
