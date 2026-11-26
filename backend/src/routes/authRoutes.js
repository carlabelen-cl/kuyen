
const express = require('express');

const {
  registrar,
  iniciarSesion,
} = require('../controllers/authController');

const verificarToken = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/registro
router.post('/registro', registrar);

// POST /api/auth/login
router.post('/login', iniciarSesion);

// GET /api/auth/verificar
router.get('/verificar', verificarToken, (req, res) => {
  res.status(200).json({
    mensaje: 'Autenticación correcta',
    usuarioId: req.usuarioId,
  });
});

module.exports = router;
