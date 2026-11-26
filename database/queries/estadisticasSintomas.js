
const path = require('path');

require('../../backend/node_modules/dotenv').config({
  path: path.join(__dirname, '../../backend/.env'),
});

const mongoose = require('../../backend/node_modules/mongoose');

const obtenerEstadisticasSintomas = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a MongoDB Atlas');

    const resultados = await mongoose.connection
      .collection('dailyrecords')
      .aggregate([
        // Seleccionar registros que tengan síntomas.
        {
          $match: {
            'registroSintomas.sintomas.0': { $exists: true },
          },
        },

        // Separar los síntomas de cada registro.
        {
          $unwind: '$registroSintomas.sintomas',
        },

        // Agrupar por síntoma y contar sus apariciones.
        {
          $group: {
            _id: '$registroSintomas.sintomas',
            cantidad: { $sum: 1 },
            usuarias: { $addToSet: '$userId' },
          },
        },

        // Preparar los resultados.
        {
          $project: {
            _id: 0,
            sintoma: '$_id',
            cantidad: 1,
            cantidadUsuarias: { $size: '$usuarias' },
          },
        },

        // Ordenar de mayor a menor frecuencia.
        {
          $sort: {
            cantidad: -1,
          },
        },
      ])
      .toArray();

    console.log('\nEstadísticas de síntomas:');
    console.log(JSON.stringify(resultados, null, 2));

  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

obtenerEstadisticasSintomas();
