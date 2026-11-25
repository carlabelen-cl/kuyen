require('dotenv').config();
console.log('¿Existe MONGODB_URI?', Boolean(process.env.MONGODB_URI));

const app = require('./app');
const conectarDB = require('./config/database');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(`Servidor de Kuyén ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

iniciarServidor();
