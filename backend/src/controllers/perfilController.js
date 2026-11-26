
const User = require('../models/User');

// Obtener el perfil clínico de la usuaria
const obtenerPerfil = async (req, res) => {
  try {
    const usuaria = await User.findById(req.usuarioId);

    if (!usuaria) {
      return res.status(404).json({
        mensaje: 'Usuaria no encontrada',
      });
    }

    res.status(200).json({
      mensaje: 'Perfil clínico obtenido correctamente',
      perfilClinico: usuaria.perfilClinico,
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error.message);

    res.status(500).json({
      mensaje: 'Error al obtener el perfil clínico',
    });
  }
};

// Actualizar el perfil clínico de la usuaria
const actualizarPerfil = async (req, res) => {
  try {
    const usuaria = await User.findById(req.usuarioId);

    if (!usuaria) {
      return res.status(404).json({
        mensaje: 'Usuaria no encontrada',
      });
    }

    const camposPermitidos = [
      'diagnosticos',
      'etapa',
      'antiguedad',
      'sintomas',
      'onboardingCompleto',
    ];

    const camposRecibidos = Object.keys(req.body);

    // Evitar actualizaciones vacías o campos no permitidos
    if (
      camposRecibidos.length === 0 ||
      camposRecibidos.some(campo => !camposPermitidos.includes(campo))
    ) {
      return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos',
      });
    }

    // Actualizar únicamente los campos permitidos
    camposRecibidos.forEach(campo => {
      usuaria.set(`perfilClinico.${campo}`, req.body[campo]);
    });

    await usuaria.save();

    res.status(200).json({
      mensaje: 'Perfil clínico actualizado correctamente',
      perfilClinico: usuaria.perfilClinico,
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error.message);

    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        mensaje: 'Los datos del perfil no cumplen con el formato esperado',
      });
    }

    res.status(500).json({
      mensaje: 'Error al actualizar el perfil clínico',
    });
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
};
