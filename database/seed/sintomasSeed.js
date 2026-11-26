const path = require('path');

const dotenv = require('../../backend/node_modules/dotenv');
dotenv.config({
  path: path.join(__dirname, '../../backend/.env'),
});

const mongoose = require('../../backend/node_modules/mongoose');

const SymptomCategory = require('../../backend/src/models/SymptomCategory');
const Symptom = require('../../backend/src/models/Symptom');

// Catálogo de categorías y síntomas de Kuyén.
const categorias = [
  {
    id: 'dolor',
    titulo: 'Dolor',
    icono: 'flame-outline',
    afinidad: [],
    sintomas: [
      ['dolor-pelvico', 'Dolor pélvico'],
      ['colicos', 'Cólicos intensos'],
      ['dolor-bajo-vientre', 'Dolor en el bajo vientre'],
      ['dolor-lumbar', 'Dolor lumbar'],
      ['dolor-ovulacion', 'Dolor en la ovulación'],
      ['dolor-piernas', 'Dolor que baja a las piernas'],
      ['dolor-evacuar', 'Dolor al evacuar'],
      ['dolor-orinar', 'Dolor al orinar'],
      ['dolor-hombro', 'Dolor en el hombro'],
      ['sensibilidad-senos', 'Sensibilidad en los senos'],
      ['dolor-incapacitante', 'Dolor que me impide hacer mi día'],
      ['dolor-frente', 'Dolor similar a migraña'],
    ],
  },
  {
    id: 'ciclo',
    titulo: 'Ciclo y sangrado',
    icono: 'water-outline',
    afinidad: [],
    sintomas: [
      ['sangrado-abundante', 'Sangrado abundante'],
      ['sangrado-prolongado', 'Sangrado prolongado'],
      ['coagulos', 'Coágulos'],
      ['manchado', 'Manchado entre reglas'],
      ['ciclo-irregular', 'Ciclos irregulares'],
      ['ciclo-ausente', 'Sin regla por meses'],
      ['sangre-evacuar-orinar', 'Sangre al evacuar u orinar en la regla'],
      ['spm-intenso', 'Síndrome premenstrual intenso'],
    ],
  },
  {
    id: 'digestivo',
    titulo: 'Digestivo y urinario',
    icono: 'restaurant-outline',
    afinidad: ['Endometriosis'],
    sintomas: [
      ['hinchazon', 'Hinchazón abdominal'],
      ['gases', 'Gases'],
      ['nauseas', 'Náuseas'],
      ['vomitos', 'Vómitos'],
      ['estrenimiento', 'Estreñimiento'],
      ['diarrea', 'Diarrea'],
      ['reflujo', 'Acidez o reflujo'],
      ['dolor-estomago', 'Dolor de estómago'],
      ['saciedad-rapida', 'Me lleno muy rápido'],
      ['cambios-apetito', 'Cambios de apetito'],
      ['malestar-comer', 'Malestar después de comer'],
      ['ganas-orinar', 'Ganas frecuentes de orinar'],
      ['urgencia-urinaria', 'Urgencia urinaria'],
      ['vejiga-irritada', 'Vejiga irritada o ardor'],
    ],
  },
  {
    id: 'energia',
    titulo: 'Energía y sueño',
    icono: 'moon-outline',
    afinidad: [],
    sintomas: [
      ['fatiga', 'Fatiga'],
      ['cansancio-extremo', 'Cansancio extremo'],
      ['niebla-mental', 'Niebla mental'],
      ['insomnio', 'Insomnio'],
      ['despertares', 'Despertares nocturnos'],
      ['sueno-poco-reparador', 'Sueño poco reparador'],
      ['somnolencia', 'Somnolencia durante el día'],
      ['bajon-tarde', 'Bajón de energía en la tarde'],
    ],
  },
  {
    id: 'animo',
    titulo: 'Ánimo y mente',
    icono: 'happy-outline',
    afinidad: [],
    sintomas: [
      ['ansiedad', 'Ansiedad'],
      ['irritabilidad', 'Irritabilidad'],
      ['tristeza', 'Tristeza'],
      ['cambios-animo', 'Cambios de ánimo'],
      ['estres', 'Estrés'],
      ['agobio', 'Sensación de agobio'],
      ['dificultad-concentrarme', 'Dificultad para concentrarme'],
      ['desmotivacion', 'Desmotivación'],
      ['ganas-llorar', 'Ganas de llorar'],
    ],
  },
  {
    id: 'piel',
    titulo: 'Piel y cabello',
    icono: 'sparkles-outline',
    afinidad: ['SOMP'],
    sintomas: [
      ['acne', 'Acné'],
      ['piel-grasa', 'Piel grasa'],
      ['piel-seca', 'Piel seca'],
      ['vello', 'Vello facial o corporal'],
      ['caida-pelo', 'Caída de cabello'],
      ['pelo-delgado', 'Cabello más delgado'],
      ['manchas-oscuras', 'Manchas oscuras en la piel'],
      ['bultitos-piel', 'Pequeños bultitos de piel'],
    ],
  },
  {
    id: 'metabolismo',
    titulo: 'Metabolismo y peso',
    icono: 'nutrition-outline',
    afinidad: ['SOMP'],
    sintomas: [
      ['antojos-dulce', 'Antojos de dulce'],
      ['hambre-excesiva', 'Hambre excesiva'],
      ['aumento-peso', 'Aumento de peso'],
      ['dificultad-bajar-peso', 'Dificultad para bajar de peso'],
      ['grasa-abdominal', 'Grasa abdominal'],
      ['bajon-tras-comer', 'Bajón de energía tras comer'],
      ['sed-aumentada', 'Sed aumentada'],
      ['temblor-hambre', 'Temblor o mareo si paso hambre'],
    ],
  },
  {
    id: 'cuerpo',
    titulo: 'Cabeza y cuerpo',
    icono: 'body-outline',
    afinidad: [],
    sintomas: [
      ['migrana', 'Migraña'],
      ['dolor-cabeza', 'Dolor de cabeza'],
      ['mareos', 'Mareos'],
      ['sensibilidad-luz-ruido', 'Sensibilidad a la luz o al ruido'],
      ['dolor-muscular', 'Dolor muscular'],
      ['dolor-articular', 'Dolor en las articulaciones'],
      ['retencion-liquidos', 'Retención de líquidos'],
      ['calores-sudor', 'Calores o sudoración nocturna'],
      ['palpitaciones', 'Palpitaciones'],
    ],
  },
  {
    id: 'intima',
    titulo: 'Salud íntima',
    icono: 'heart-outline',
    afinidad: [],
    sintomas: [
      ['dolor-relaciones', 'Dolor en las relaciones sexuales'],
      ['sangrado-relaciones', 'Sangrado después de relaciones'],
      ['libido-baja', 'Libido baja'],
      ['sequedad', 'Sequedad vaginal'],
      ['picazon-irritacion', 'Picazón o irritación'],
    ],
  },
];

const ejecutarSeed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('No se encontró MONGODB_URI en backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a MongoDB Atlas');

    // Insertar o actualizar categorías.
    const operacionesCategorias = categorias.map((categoria) => ({
      updateOne: {
        filter: { id: categoria.id },
        update: {
          $set: {
            id: categoria.id,
            titulo: categoria.titulo,
            icono: categoria.icono,
            afinidad: categoria.afinidad,
          },
        },
        upsert: true,
      },
    }));

    await SymptomCategory.bulkWrite(operacionesCategorias);

    // Convertir los síntomas al formato del modelo Symptom.
    const sintomas = categorias.flatMap((categoria) =>
      categoria.sintomas.map(([id, nombre]) => ({
        id,
        nombre,
        categoriaId: categoria.id,
        activo: true,
      }))
    );

    // Insertar o actualizar síntomas.
    const operacionesSintomas = sintomas.map((sintoma) => ({
      updateOne: {
        filter: { id: sintoma.id },
        update: { $set: sintoma },
        upsert: true,
      },
    }));

    await Symptom.bulkWrite(operacionesSintomas);

    console.log('Seed ejecutado correctamente');
    console.log(`Categorías procesadas: ${categorias.length}`);
    console.log(`Síntomas procesados: ${sintomas.length}`);
  } catch (error) {
    console.error('Error al ejecutar el seed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

ejecutarSeed();
