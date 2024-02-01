const { calcularRota } = require('../controllers/rota.controllers');
const express = require('express');

const router = express.Router();

router.get('/', calcularRota);

module.exports = router;
