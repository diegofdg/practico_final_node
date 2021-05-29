const express = require('express');
const router = express.Router();

var categoria = require('../controllers/categoria_controller');
const home_controller = require('../controllers/home_controller');


router.get('/', home_controller.get_home_page);
router.get('/categoria', categoria.getCategory);
router.get('/categoria/:id',(req,res)=>{ res.status(413).send({'prueba':'eeeee'});});


module.exports = router;