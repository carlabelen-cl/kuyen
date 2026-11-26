
const express = require('express');

const {
  crearRegistro,
  obtenerRegistros,
  obtenerRegistroPorId,
  actualizarRegistro,
  eliminarRegistro,
} = require('../controllers/dailyRecordController');

const verificarToken = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación.
router.use(verificarToken);

// Crear un registro diario.
router.post('/', crearRegistro);

// Obtener todos los registros o filtrar por fecha.
router.get('/', obtenerRegistros);

// Obtener un registro específico.
router.get('/:id', obtenerRegistroPorId);

// Actualizar un registro.
router.put('/:id', actualizarRegistro);

// Eliminar un registro.
router.delete('/:id', eliminarRegistro);

module.exports = router;
