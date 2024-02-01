const express = require('express');
const { calcularRota } = require('../controllers/rota.controllers');

const router = express.Router();

router.get('/', calcularRota);

module.exports = router;
