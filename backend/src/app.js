
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const sintomasRoutes = require('./routes/sintomasRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/sintomas', sintomasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenida a la API de Kuyén',
  });
});

module.exports = app;
