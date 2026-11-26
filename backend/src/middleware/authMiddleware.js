
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    // Obtener el token enviado en la petición
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'No autorizado. Debes iniciar sesión.',
      });
    }

    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];

    // Verificar que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar el ID de la usuaria para usarlo en los controladores
    req.usuarioId = decoded.id;

    // Continuar con la siguiente función
    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado.',
    });
  }
};

module.exports = verificarToken;
