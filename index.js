const express=require('express');
//const bodyParser = require('body-parser');
const app=express();
const port=process.env.PORT||3000;
const host=process.env.HOST||'localhost';


//app.use(express.urlencoded()); //body formulario
//app.use(express.json()); // body en formato json

const db = require('./config/db');


db.authenticate()
.then(()=>{
    db.sync()
    .then(() => console.log('Conectado al Servidor Mysql'))
    .catch(error => console.log(error.message));
})
.catch((error)=>console.log(error.message))


const routes =require('./routes/index');
app.use('/', routes);

app.use((error,req,res,next)=>{
    console.log('entre'); 
    res.status(413).send({'error':error.message});     
});



//Servidor
app.listen(port,host,(req,res)=>{
    console.log('Servidor '+host+' escuchando puerto:'+port);
});