
const express = require('express');

const {
  obtenerCategorias,
  obtenerSintomas,
} = require('../controllers/sintomasController');

const router = express.Router();

// Obtener todas las categorías.
router.get('/categorias', obtenerCategorias);

// Obtener todos los síntomas o filtrarlos por categoría.
router.get('/', obtenerSintomas);

module.exports = router;
