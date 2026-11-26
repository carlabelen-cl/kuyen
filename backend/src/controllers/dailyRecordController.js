
const DailyRecord = require('../models/DailyRecord');

// Convertir YYYY-MM-DD al inicio del día en UTC.
const normalizarFecha = (fecha) => {
  if (
    typeof fecha !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
  ) {
    return null;
  }

  const fechaNormalizada = new Date(`${fecha}T00:00:00.000Z`);

  if (
    Number.isNaN(fechaNormalizada.getTime()) ||
    fechaNormalizada.toISOString().slice(0, 10) !== fecha
  ) {
    return null;
  }

  return fechaNormalizada;
};

// Crear un registro diario.
const crearRegistro = async (req, res) => {
  try {
    const { fecha, registroSintomas, diario } = req.body;

    const fechaNormalizada = normalizarFecha(fecha);

    if (!fechaNormalizada) {
      return res.status(400).json({
        mensaje: 'Debes proporcionar una fecha válida en formato YYYY-MM-DD',
      });
    }

    const nuevoRegistro = await DailyRecord.create({
      userId: req.usuarioId,
      fecha: fechaNormalizada,
      registroSintomas,
      diario,
    });

    res.status(201).json({
      mensaje: 'Registro diario creado correctamente',
      registro: nuevoRegistro,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: 'Ya existe un registro para esta fecha',
      });
    }

    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        mensaje: 'Los datos del registro no son válidos',
      });
    }

    console.error('Error al crear registro:', error.message);

    res.status(500).json({
      mensaje: 'Error al crear el registro diario',
    });
  }
};

// Obtener todos los registros de la usuaria.
const obtenerRegistros = async (req, res) => {
  try {
    const filtro = { userId: req.usuarioId };

    if (req.query.fecha) {
      const fecha = normalizarFecha(req.query.fecha);

      if (!fecha) {
        return res.status(400).json({
          mensaje: 'La fecha debe tener el formato YYYY-MM-DD',
        });
      }

      filtro.fecha = fecha;
    }

    const registros = await DailyRecord.find(filtro)
      .sort({ fecha: -1 })
      .lean();

    res.status(200).json({
      mensaje: 'Registros obtenidos correctamente',
      total: registros.length,
      registros,
    });
  } catch (error) {
    console.error('Error al obtener registros:', error.message);

    res.status(500).json({
      mensaje: 'Error al obtener los registros',
    });
  }
};

// Obtener un registro específico.
const obtenerRegistroPorId = async (req, res) => {
  try {
    const registro = await DailyRecord.findOne({
      _id: req.params.id,
      userId: req.usuarioId,
    });

    if (!registro) {
      return res.status(404).json({
        mensaje: 'Registro no encontrado',
      });
    }

    res.status(200).json({
      mensaje: 'Registro obtenido correctamente',
      registro,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        mensaje: 'El identificador del registro no es válido',
      });
    }

    console.error('Error al obtener registro:', error.message);

    res.status(500).json({
      mensaje: 'Error al obtener el registro',
    });
  }
};

// Actualizar un registro existente.
const actualizarRegistro = async (req, res) => {
  try {
    const camposPermitidos = ['registroSintomas', 'diario'];
    const camposRecibidos = Object.keys(req.body);

    if (
      camposRecibidos.length === 0 ||
      camposRecibidos.some(
        (campo) => !camposPermitidos.includes(campo)
      )
    ) {
      return res.status(400).json({
        mensaje: 'Solo puedes actualizar registroSintomas y diario',
      });
    }

    const registro = await DailyRecord.findOne({
      _id: req.params.id,
      userId: req.usuarioId,
    });

    if (!registro) {
      return res.status(404).json({
        mensaje: 'Registro no encontrado',
      });
    }

    camposRecibidos.forEach((campo) => {
      registro.set(campo, req.body[campo]);
    });

    await registro.save();

    res.status(200).json({
      mensaje: 'Registro actualizado correctamente',
      registro,
    });
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos',
      });
    }

    console.error('Error al actualizar registro:', error.message);

    res.status(500).json({
      mensaje: 'Error al actualizar el registro',
    });
  }
};

// Eliminar un registro.
const eliminarRegistro = async (req, res) => {
  try {
    const registro = await DailyRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.usuarioId,
    });

    if (!registro) {
      return res.status(404).json({
        mensaje: 'Registro no encontrado',
      });
    }

    res.status(200).json({
      mensaje: 'Registro eliminado correctamente',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        mensaje: 'El identificador del registro no es válido',
      });
    }

    console.error('Error al eliminar registro:', error.message);

    res.status(500).json({
      mensaje: 'Error al eliminar el registro',
    });
  }
};

module.exports = {
  crearRegistro,
  obtenerRegistros,
  obtenerRegistroPorId,
  actualizarRegistro,
  eliminarRegistro,
};
