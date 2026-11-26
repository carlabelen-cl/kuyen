
const path = require('path');

require('../../backend/node_modules/dotenv').config({
  path: path.join(__dirname, '../../backend/.env'),
});

const mongoose = require('../../backend/node_modules/mongoose');

const User = require('../../backend/src/models/User');
const DailyRecord = require('../../backend/src/models/DailyRecord');

const ejecutarCRUD = async () => {
  let usuario;
  const fechaPrueba = new Date('2026-11-26T00:00:00.000Z');

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a MongoDB Atlas');

    // Buscar una usuaria de prueba.
    usuario = await User.findOne({
      correo: 'demo.kuyen01@example.com',
    });

    if (!usuario) {
      throw new Error('No se encontró la usuaria de prueba.');
    }

    // 1. CREATE: crear un registro diario.
    const nuevoRegistro = await DailyRecord.create({
      userId: usuario._id,
      fecha: fechaPrueba,
      registroSintomas: {
        dolores: [
          {
            sintomaId: 'dolor-pelvico',
            intensidad: 5,
          },
        ],
        nivelSangrado: 'leve',
        sintomas: ['dolor-pelvico'],
      },
      diario: {
        estaMenstruando: true,
        notas: 'Registro creado para probar operaciones CRUD.',
      },
    });

    console.log('\n1. CREATE: registro creado');
    console.log(nuevoRegistro._id.toString());

    // 2. READ: consultar los registros de la usuaria.
    const registros = await DailyRecord.find({
      userId: usuario._id,
    }).sort({ fecha: -1 });

    console.log('\n2. READ: registros de la usuaria');
    console.log(`Total encontrado: ${registros.length}`);

    // 3. READ: consultar un registro específico.
    const registroEncontrado = await DailyRecord.findOne({
      _id: nuevoRegistro._id,
      userId: usuario._id,
    });

    console.log('\n3. READ: registro específico');
    console.log(registroEncontrado._id.toString());

    // 4. UPDATE: modificar el registro.
    const registroActualizado = await DailyRecord.findOneAndUpdate(
      {
        _id: nuevoRegistro._id,
        userId: usuario._id,
      },
      {
        $set: {
          'diario.notas': 'Registro actualizado correctamente.',
        },
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    console.log('\n4. UPDATE: registro actualizado');
    console.log(registroActualizado.diario.notas);

    // 5. DELETE: eliminar el registro de prueba.
    const registroEliminado = await DailyRecord.findOneAndDelete({
      _id: nuevoRegistro._id,
      userId: usuario._id,
    });

    console.log('\n5. DELETE: registro eliminado');
    console.log(
      registroEliminado
        ? 'Eliminación exitosa'
        : 'No se encontró el registro'
    );

  } catch (error) {
    console.error('\nError al ejecutar las operaciones CRUD:', error.message);
  } finally {
    // Evitar dejar el registro de prueba en la base de datos.
    if (usuario) {
      await DailyRecord.deleteOne({
        userId: usuario._id,
        fecha: fechaPrueba,
      });
    }

    await mongoose.disconnect();
  }
};

ejecutarCRUD();
