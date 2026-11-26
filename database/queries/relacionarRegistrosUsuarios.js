
const path = require('path');

// Cargar variables de entorno.
require('../../backend/node_modules/dotenv').config({
  path: path.join(__dirname, '../../backend/.env'),
});

const mongoose = require('../../backend/node_modules/mongoose');

// Agregación para relacionar registros diarios con sus usuarias.
const relacionarRegistrosUsuarios = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a MongoDB Atlas');

    const resultados = await mongoose.connection
      .collection('dailyrecords')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'usuaria',
          },
        },
        {
          $unwind: '$usuaria',
        },
        {
          $project: {
            _id: 0,
            fecha: 1,
            'usuaria.nombre': 1,
            'usuaria.correo': 1,
            'registroSintomas.nivelSangrado': 1,
            'diario.notas': 1,
          },
        },
        {
          $sort: {
            fecha: 1,
          },
        },
      ])
      .toArray();

    console.log('\nRegistros diarios relacionados con sus usuarias:');
    console.log(JSON.stringify(resultados, null, 2));

    console.log(`\nTotal de registros relacionados: ${resultados.length}`);
  } catch (error) {
    console.error('Error al ejecutar la agregación:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

relacionarRegistrosUsuarios();
