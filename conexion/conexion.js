const mysql=require('mysql');
const util=require('util');

//conexion
let conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'biblioteca'
});


module.exports = conn;