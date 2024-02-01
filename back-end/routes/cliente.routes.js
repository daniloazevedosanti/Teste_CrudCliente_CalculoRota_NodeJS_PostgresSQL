const clienteService = require('../controllers/cliente.controllers');
const express = require('express');


const router = express.Router();

router.get('/', clienteService.listar);
router.post('/', clienteService.cadastrar);
router.delete('/:id', clienteService.excluir);

module.exports = router;