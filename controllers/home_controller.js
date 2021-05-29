const express = require('express');
const router = express.Router();

exports.get_home_page = router.get('/',(req,res) => {
    res.status(200).send('Esta es la pagina inicial');
});

