//Importamos las dependencias
const express = require('express');
const router = express.Router();

//Importamos los controladores
const home_controller = require('../controllers/home_controller');
const categoriasController = require('../controllers/categoriasController');
const personasController = require('../controllers/personasController');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//Ruta para el home
router.get('/', home_controller.get_home_page);

//Rutas Categorias
router.get('/categoria',categoriasController.categoriaGet);
router.get('/categoria/:id', categoriasController.categoriaGetId);
router.post('/categoria/', categoriasController.categoriaCreate);
router.delete('/categoria/:id', categoriasController.categoriaDelete);

//Rutas Personas
router.get('/persona', personasController.personasGetAll);
router.get('/persona/:id', personasController.personaGetId);
router.post('/persona', personasController.personaAdd);
router.put('/persona/:id', personasController.personaUpdateId);
router.delete('/persona/:id', personasController.personaDeleteId);

//Rutas Libros


module.exports = router;