
const mongoose = require('mongoose');

// Intensidad de cada tipo de dolor.
const dolorSchema = new mongoose.Schema(
  {
    sintomaId: {
      type: String,
      required: true,
    },
    intensidad: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { _id: false }
);

// Ingredientes y síntomas que la usuaria asocia a ellos.
const ingredienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    sintomasAsociados: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

// Actividades físicas realizadas.
const actividadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    intensidad: {
      type: String,
      enum: ['leve', 'moderada', 'intensa'],
      required: true,
    },
    sensacionDespues: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

// Medicamentos agregados por la propia usuaria.
const medicamentoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    dosis: {
      type: String,
      default: '',
    },
    cantidad: {
      type: Number,
      min: 0,
      default: 1,
    },
    unidad: {
      type: String,
      default: 'unidad',
    },
    tomado: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// Registro de síntomas y experiencias del día.
const registroSintomasSchema = new mongoose.Schema(
  {
    ingredientes: {
      type: [ingredienteSchema],
      default: [],
    },

    dolores: {
      type: [dolorSchema],
      default: [],
    },

    nivelSangrado: {
      type: String,
      enum: ['ninguno', 'leve', 'moderado', 'intenso'],
      default: 'ninguno',
    },

    sintomas: {
      type: [String],
      default: [],
    },

    sintomasMetabolicoHormonales: {
      type: [String],
      default: [],
    },

    actividadesFisicas: {
      type: [actividadSchema],
      default: [],
    },

    emociones: {
      type: [String],
      default: [],
    },

    sueno: {
      horas: {
        type: Number,
        min: 0,
        max: 24,
        default: null,
      },
      sensacionDespues: {
        type: String,
        default: '',
      },
    },
  },
  { _id: false }
);

// Información de la pantalla "Mi diario".
const diarioSchema = new mongoose.Schema(
  {
    estaMenstruando: {
      type: Boolean,
      default: false,
    },

    medicamentos: {
      type: [medicamentoSchema],
      default: [],
    },

    notas: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

// Documento principal.
const dailyRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    fecha: {
      type: Date,
      required: true,
    },

    registroSintomas: {
      type: registroSintomasSchema,
      default: () => ({}),
    },

    diario: {
      type: diarioSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Una usuaria tendrá un único registro por fecha.
dailyRecordSchema.index(
  { userId: 1, fecha: 1 },
  { unique: true }
);

module.exports = mongoose.model('DailyRecord', dailyRecordSchema);
