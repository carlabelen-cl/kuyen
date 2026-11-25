
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenida a la API de Kuyén'
  });
});

module.exports = app;
