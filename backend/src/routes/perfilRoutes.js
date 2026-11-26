
const express = require('express');

const {
  obtenerPerfil,
  actualizarPerfil,
} = require('../controllers/perfilController');

const verificarToken = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener el perfil clínico
router.get('/', verificarToken, obtenerPerfil);

// Actualizar el perfil clínico
router.put('/', verificarToken, actualizarPerfil);

module.exports = router;
