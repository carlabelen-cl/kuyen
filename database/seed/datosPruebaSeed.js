
const path = require('path');

require('../../backend/node_modules/dotenv').config({
  path: path.join(__dirname, '../../backend/.env'),
});

const mongoose = require('../../backend/node_modules/mongoose');
const bcrypt = require('../../backend/node_modules/bcryptjs');

const User = require('../../backend/src/models/User');
const DailyRecord = require('../../backend/src/models/DailyRecord');

// Diez usuarias ficticias para las pruebas de Kuyén.
const usuarias = [
  { nombre: 'Camila Torres', edad: 24, correo: 'demo.kuyen01@example.com', diagnosticos: ['Endometriosis'], sintomas: ['dolor-pelvico', 'fatiga'] },
  { nombre: 'Valentina Rojas', edad: 29, correo: 'demo.kuyen02@example.com', diagnosticos: ['Adenomiosis'], sintomas: ['colicos', 'sangrado-abundante'] },
  { nombre: 'Fernanda Silva', edad: 22, correo: 'demo.kuyen03@example.com', diagnosticos: ['Endometriosis', 'Adenomiosis'], sintomas: ['hinchazon', 'nauseas'] },
  { nombre: 'Daniela Muñoz', edad: 31, correo: 'demo.kuyen04@example.com', diagnosticos: ['SOMP'], sintomas: ['acne', 'cambios-apetito'] },
  { nombre: 'Antonia Pérez', edad: 26, correo: 'demo.kuyen05@example.com', diagnosticos: ['Endometriosis'], sintomas: ['dolor-lumbar', 'diarrea'] },
  { nombre: 'Javiera Castro', edad: 27, correo: 'demo.kuyen06@example.com', diagnosticos: ['Adenomiosis'], sintomas: ['sangrado-prolongado', 'fatiga'] },
  { nombre: 'Isidora Vega', edad: 23, correo: 'demo.kuyen07@example.com', diagnosticos: ['Endometriosis'], sintomas: ['dolor-evacuar', 'hinchazon'] },
  { nombre: 'Martina Díaz', edad: 30, correo: 'demo.kuyen08@example.com', diagnosticos: ['SOMP'], sintomas: ['piel-grasa', 'hambre-excesiva'] },
  { nombre: 'Josefa Herrera', edad: 25, correo: 'demo.kuyen09@example.com', diagnosticos: ['Endometriosis', 'Adenomiosis'], sintomas: ['migrana', 'mareos'] },
  { nombre: 'Florencia Soto', edad: 28, correo: 'demo.kuyen10@example.com', diagnosticos: ['Adenomiosis'], sintomas: ['dolor-bajo-vientre', 'retencion-liquidos'] },
];

// Un registro ficticio por usuaria.
const registrosBase = [
  { fecha: '2026-11-01', sintomas: ['dolor-pelvico', 'fatiga'], dolor: 7, sangrado: 'moderado', nota: 'Dolor pélvico durante la mañana.' },
  { fecha: '2026-11-02', sintomas: ['colicos', 'sangrado-abundante'], dolor: 8, sangrado: 'intenso', nota: 'Cólic​os y sangrado durante el día.' },
  { fecha: '2026-11-03', sintomas: ['hinchazon', 'nauseas'], dolor: 4, sangrado: 'leve', nota: 'Hinchazón después de las comidas.' },
  { fecha: '2026-11-04', sintomas: ['acne', 'cambios-apetito'], dolor: 2, sangrado: 'ninguno', nota: 'Cambios de apetito y piel.' },
  { fecha: '2026-11-05', sintomas: ['dolor-lumbar', 'diarrea'], dolor: 6, sangrado: 'moderado', nota: 'Molestias lumbares y digestivas.' },
  { fecha: '2026-11-06', sintomas: ['sangrado-prolongado', 'fatiga'], dolor: 5, sangrado: 'intenso', nota: 'Cansancio durante el día.' },
  { fecha: '2026-11-07', sintomas: ['dolor-evacuar', 'hinchazon'], dolor: 7, sangrado: 'leve', nota: 'Molestias digestivas y pélvicas.' },
  { fecha: '2026-11-08', sintomas: ['piel-grasa', 'hambre-excesiva'], dolor: 2, sangrado: 'ninguno', nota: 'Cambios en apetito y piel.' },
  { fecha: '2026-11-09', sintomas: ['migrana', 'mareos'], dolor: 6, sangrado: 'moderado', nota: 'Dolor de cabeza y mareos.' },
  { fecha: '2026-11-10', sintomas: ['dolor-bajo-vientre', 'retencion-liquidos'], dolor: 5, sangrado: 'moderado', nota: 'Dolor y sensación de hinchazón.' },
];

const ejecutarSeed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('No se encontró MONGODB_URI en backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB Atlas');

    // Generar una contraseña de prueba compartida.
    const passwordHash = await bcrypt.hash('KuyenDemo123!', 12);

    // Crear o actualizar las diez usuarias ficticias.
    const operacionesUsuarios = usuarias.map((usuaria) => ({
      updateOne: {
        filter: { correo: usuaria.correo },
        update: {
          $set: {
            nombre: usuaria.nombre,
            edad: usuaria.edad,
            correo: usuaria.correo,
            passwordHash,
            perfilClinico: {
              diagnosticos: usuaria.diagnosticos,
              etapa: null,
              antiguedad: null,
              sintomas: usuaria.sintomas,
              onboardingCompleto: true,
            },
          },
        },
        upsert: true,
      },
    }));

    await User.bulkWrite(operacionesUsuarios);

    // Recuperar los identificadores generados por MongoDB.
    const usuariosGuardados = await User.find({
      correo: { $in: usuarias.map((u) => u.correo) },
    }).lean();

    const usuariosPorCorreo = new Map(
      usuariosGuardados.map((u) => [u.correo, u])
    );

    // Relacionar cada registro con su usuaria.
    const operacionesRegistros = registrosBase.map((registro, index) => {
      const usuaria = usuarias[index];
      const usuarioGuardado = usuariosPorCorreo.get(usuaria.correo);

      if (!usuarioGuardado) {
        throw new Error(`No se encontró la usuaria ${usuaria.correo}`);
      }

      const fecha = new Date(`${registro.fecha}T00:00:00.000Z`);

      const documento = {
        userId: usuarioGuardado._id,
        fecha,
        registroSintomas: {
          ingredientes: [],
          dolores: [
            {
              sintomaId: registro.sintomas[0],
              intensidad: registro.dolor,
            },
          ],
          nivelSangrado: registro.sangrado,
          sintomas: registro.sintomas,
          sintomasMetabolicoHormonales: [],
          actividadesFisicas: [],
          emociones: [],
          sueno: {
            horas: 7,
            sensacionDespues: 'Descanso regular',
          },
        },
        diario: {
          estaMenstruando: registro.sangrado !== 'ninguno',
          medicamentos: [],
          notas: registro.nota,
        },
      };

      return {
        updateOne: {
          filter: {
            userId: usuarioGuardado._id,
            fecha,
          },
          update: { $set: documento },
          upsert: true,
        },
      };
    });

    await DailyRecord.bulkWrite(operacionesRegistros);

    console.log('Seed de datos de prueba ejecutado correctamente');
    console.log(`Usuarias procesadas: ${usuariosGuardados.length}`);
    console.log(`Registros procesados: ${operacionesRegistros.length}`);
  } catch (error) {
    console.error('Error al ejecutar el seed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

ejecutarSeed();
