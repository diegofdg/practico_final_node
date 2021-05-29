const express = require('express');
const router = express.Router();

var categoria = require('../controllers/categoria_controller');



router.get('/categoria', categoria.getCategory);
router.get('/categoria/:id',(req,res)=>{ res.status(413).send({'prueba':'eeeee'});});


module.exports = router;