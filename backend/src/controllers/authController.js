
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar una nueva usuaria
const registrar = async (req, res) => {
  try {
    const { nombre, edad, correo, clave } = req.body;

    // Validar campos obligatorios
    if (!nombre || !edad || !correo || !clave) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios',
      });
    }

    // Comprobar si el correo ya está registrado
    const usuariaExistente = await User.findOne({
      correo: correo.trim().toLowerCase(),
    });

    if (usuariaExistente) {
      return res.status(409).json({
        mensaje: 'El correo ya está registrado',
      });
    }

    // Cifrar contraseña
    const passwordHash = await bcrypt.hash(clave, 12);

    // Crear usuaria
    const nuevaUsuaria = await User.create({
      nombre,
      edad,
      correo,
      passwordHash,
    });

    res.status(201).json({
      mensaje: 'Cuenta creada correctamente',
      usuaria: {
        id: nuevaUsuaria._id,
        nombre: nuevaUsuaria.nombre,
        edad: nuevaUsuaria.edad,
        correo: nuevaUsuaria.correo,
      },
    });
  } catch (error) {
    console.error('Error al registrar:', error.message);

    res.status(500).json({
      mensaje: 'Error al crear la cuenta',
    });
  }
};

// Iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    if (!correo || !clave) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios',
      });
    }

    // Buscar usuaria
    const usuaria = await User.findOne({
      correo: correo.trim().toLowerCase(),
    });

    if (!usuaria) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas',
      });
    }

    // Comparar contraseña
    const claveValida = await bcrypt.compare(
      clave,
      usuaria.passwordHash
    );

    if (!claveValida) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas',
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuaria._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      mensaje: 'Sesión iniciada correctamente',
      token,
      usuaria: {
        id: usuaria._id,
        nombre: usuaria.nombre,
        edad: usuaria.edad,
        correo: usuaria.correo,
        perfilClinico: usuaria.perfilClinico,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);

    res.status(500).json({
      mensaje: 'Error al iniciar sesión',
    });
  }
};

module.exports = {
  registrar,
  iniciarSesion,
};
