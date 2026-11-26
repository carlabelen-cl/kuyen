
const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    categoriaId: {
      type: String,
      required: true,
      trim: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
// Índice para optimizar la búsqueda de síntomas por categoría y estado.
symptomSchema.index({ categoriaId: 1, activo: 1 });
module.exports = mongoose.model('Symptom', symptomSchema);
