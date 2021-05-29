const express = require('express');
const router = express.Router();


var categoria = require('../controllers/categoria_controller');
const home_controller = require('../controllers/home_controller');

router.get('/', home_controller.get_home_page);

router.post('/categoria', categoria.setCategory);
router.get('/categoria', categoria.getAllCategories);
router.get('/categoria/:id', categoria.getCategory);
router.delete('/categoria/:id', categoria.removeCategory);

module.exports = router;