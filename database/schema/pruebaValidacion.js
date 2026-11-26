
const path = require('path');

require('../../backend/node_modules/dotenv').config({
  path: path.join(__dirname, '../../backend/.env'),
});

const mongoose = require('../../backend/node_modules/mongoose');

const DailyRecord = require('../../backend/src/models/DailyRecord');

const probarValidacion = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a MongoDB Atlas');

    await DailyRecord.create({
      userId: new mongoose.Types.ObjectId(),
      fecha: new Date('2026-11-26T00:00:00.000Z'),

      registroSintomas: {
        dolores: [
          {
            sintomaId: 'dolor-pelvico',
            intensidad: 11,
          },
        ],
      },
    });

    console.log('El documento fue aceptado inesperadamente.');

  } catch (error) {
    if (error.name === 'ValidationError') {
      console.log('\nDocumento rechazado correctamente.');
      console.log('Motivo de la validación:');

      Object.values(error.errors).forEach((detalle) => {
        console.log(`- ${detalle.path}: ${detalle.message}`);
      });
    } else {
      console.error('Error inesperado:', error.message);
    }
  } finally {
    await mongoose.disconnect();
  }
};

probarValidacion();
