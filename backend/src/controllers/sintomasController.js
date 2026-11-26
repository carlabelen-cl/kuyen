
const SymptomCategory = require('../models/SymptomCategory');
const Symptom = require('../models/Symptom');

// Obtener todas las categorías de síntomas.
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await SymptomCategory.find()
      .sort({ id: 1 })
      .lean();

    res.status(200).json({
      mensaje: 'Categorías obtenidas correctamente',
      total: categorias.length,
      categorias,
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error.message);

    res.status(500).json({
      mensaje: 'Error al obtener las categorías',
    });
  }
};

// Obtener síntomas, opcionalmente filtrados por categoría.
const obtenerSintomas = async (req, res) => {
  try {
    const { categoria } = req.query;

    const filtro = { activo: true };

    if (categoria) {
      const categoriaExiste = await SymptomCategory.exists({
        id: categoria,
      });

      if (!categoriaExiste) {
        return res.status(404).json({
          mensaje: 'La categoría solicitada no existe',
        });
      }

      filtro.categoriaId = categoria;
    }

    const sintomas = await Symptom.find(filtro)
      .sort({ id: 1 })
      .lean();

    res.status(200).json({
      mensaje: 'Síntomas obtenidos correctamente',
      total: sintomas.length,
      sintomas,
    });
  } catch (error) {
    console.error('Error al obtener síntomas:', error.message);

    res.status(500).json({
      mensaje: 'Error al obtener los síntomas',
    });
  }
};

module.exports = {
  obtenerCategorias,
  obtenerSintomas,
};
