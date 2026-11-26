
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

module.exports = mongoose.model('Symptom', symptomSchema);
